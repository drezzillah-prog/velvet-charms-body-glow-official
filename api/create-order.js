import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Empty cart" });
    }

    const total = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    ).toFixed(2);

    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const tokenRes = await fetch(
      "https://api-m.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      }
    );

    const tokenData = await tokenRes.json();

    const orderRes = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: total
              }
            }
          ]
        })
      }
    );

    const orderData = await orderRes.json();

    const approve = orderData.links.find(l => l.rel === "approve");

    res.status(200).json({ approveUrl: approve.href });

  } catch (err) {
    console.error("PayPal order error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
