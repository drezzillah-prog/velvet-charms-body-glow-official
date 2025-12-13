export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { cart } = req.body || {};
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    // ---- ENV VARIABLES ----
    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const SECRET = process.env.PAYPAL_SECRET;
    const MODE = process.env.PAYPAL_MODE || "live";

    if (!CLIENT_ID || !SECRET) {
      return res.status(500).json({
        error: "Missing PayPal credentials",
      });
    }

    const BASE =
      MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    // ---- AUTH ----
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64");

    const tokenRes = await fetch(`${BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenData?.access_token) {
      return res.status(500).json({
        error: "PayPal auth failed",
        details: tokenData,
      });
    }

    const accessToken = tokenData.access_token;

    // ---- BUILD ITEMS ----
    const items = cart.items.map((item) => ({
      name: item.name || `Product ${item.id}`,
      unit_amount: {
        currency_code: "USD",
        value: Number(item.price).toFixed(2),
      },
      quantity: String(item.qty || 1),
    }));

    const total = items.reduce(
      (sum, i) => sum + Number(i.unit_amount.value) * Number(i.quantity),
      0
    );

    const orderBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total.toFixed(2),
              },
            },
          },
          items,
        },
      ],
      application_context: {
        brand_name: "Velvet Charms",
        user_action: "PAY_NOW",
        return_url: "https://velvet-charms-body-glow-official.vercel.app/return",
        cancel_url: "https://velvet-charms-body-glow-official.vercel.app/cancel",
      },
    };

    // ---- CREATE ORDER ----
    const orderRes = await fetch(`${BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const raw = await orderRes.text();
    let orderData;

    try {
      orderData = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "Invalid PayPal response",
        details: raw,
      });
    }

    if (!orderData.id) {
      return res.status(500).json({
        error: "Order creation failed",
        details: orderData,
      });
    }

    const approveUrl =
      orderData.links?.find((l) => l.rel === "approve")?.href || null;

    return res.status(200).json({
      orderID: orderData.id,
      approveUrl,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: String(err),
    });
  }
}
