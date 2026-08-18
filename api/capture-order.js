const CURRENCY = "USD";

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

function paypalSecret() {
  return process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET;
}

async function accessToken(baseUrl) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = paypalSecret();

  if (!clientId || !secret) {
    throw new Error("PAYPAL_NOT_CONFIGURED");
  }

  const authorization = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error("PayPal authentication failed:", response.status, data);
    throw new Error("PAYPAL_AUTHENTICATION_FAILED");
  }

  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orderID = String(req.body?.orderID || "");
  if (!/^[A-Z0-9]{1,36}$/.test(orderID)) {
    return res.status(400).json({ error: "Missing or invalid PayPal order ID." });
  }

  try {
    const baseUrl = paypalBaseUrl();
    const token = await accessToken(baseUrl);

    const response = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        }
      }
    );

    const capture = await response.json();
    if (!response.ok) {
      console.error("PayPal capture failed:", response.status, capture);
      return res.status(502).json({ error: "PayPal could not confirm the payment." });
    }

    const capturedAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    if (capture.status !== "COMPLETED" || capturedAmount?.currency_code !== CURRENCY) {
      console.error("Unexpected PayPal capture response:", capture);
      return res.status(502).json({ error: "PayPal payment was not completed." });
    }

    return res.status(200).json({
      status: capture.status,
      orderID: capture.id,
      captureID: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
    });
  } catch (error) {
    console.error("Capture order error:", error);

    if (error.message === "PAYPAL_NOT_CONFIGURED") {
      return res.status(503).json({ error: "PayPal is not configured yet." });
    }

    return res.status(500).json({ error: "Payment confirmation failed." });
  }
}

