// FORCE REBUILD 2025-12-12
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { cart } = req.body || {};
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    // ---- ENV VARIABLES (correct names!) ----
    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const SECRET = process.env.PAYPAL_SECRET;      // FIXED NAME
    const MODE = process.env.PAYPAL_MODE || "live";

    const BASE =
      MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    // ---- AUTH TOKEN ----
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64");

    const tokenRes = await fetch(`${BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenData || !tokenData.access_token) {
      console.error("TOKEN ERROR:", tokenData);
      return res.status(500).json({
        error: "Unable to authenticate with PayPal",
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

    // ---- ORDER BODY ----
    const orderBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: total.toFixed(2) },
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
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const raw = await orderRes.text();
    let orderData;

    try {
      orderData = JSON.parse(raw);
    } catch (e) {
      console.error("PAYPAL RAW RESPONSE:", raw);
      return res.status(500).json({
        error: "Invalid response from PayPal",
        details: raw,
      });
    }

    if (!orderData.id) {
      console.error("ORDER CREATE ERROR:", orderData);
      return res.status(500).json({ error: "Failed to create order", details: orderData });
    }

    const approveUrl = orderData.links.find((l) => l.rel === "approve")?.href;

    return res.status(200).json({
      orderID: orderData.id,
      approveUrl,
    });
  } catch (err) {
    console.error("CREATE-ORDER EXCEPTION:", err);
    return res.status(500).json({
      error: "Create order error",
      details: String(err),
    });
  }
};
