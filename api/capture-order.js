import { readFileSync } from "node:fs";
import { join } from "node:path";
import { get } from "@vercel/blob";

const CURRENCY = "USD";

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

function paypalSecret() {
  return process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET;
}

function catalogueProducts() {
  const catalogue = JSON.parse(
    readFileSync(join(process.cwd(), "catalogue-body-glow.json"), "utf8")
  );
  const products = [];
  for (const category of catalogue.categories || []) {
    products.push(...(category.products || []));
    for (const subcategory of category.subcategories || []) {
      products.push(...(subcategory.products || []));
    }
  }
  return new Map(products.map(product => [product.id, product]));
}

function validatedItems(requestBody) {
  const rawItems = requestBody?.cart?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100) {
    throw new Error("INVALID_CART");
  }

  const catalogue = catalogueProducts();
  return rawItems.map(rawItem => {
    const product = catalogue.get(rawItem?.id);
    const quantity = Number.parseInt(rawItem?.qty, 10);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("INVALID_CART");
    }

    const options = {};
    const rawOptions = rawItem?.options && typeof rawItem.options === "object"
      ? rawItem.options
      : {};
    for (const [key, value] of Object.entries(rawOptions)) {
      const cleanValue = String(value || "").trim().slice(0, 1000);
      if (!cleanValue) continue;
      if (key === "special_instructions") {
        options[key] = cleanValue;
        continue;
      }
      const allowedValues = product.options?.[key];
      if (!Array.isArray(allowedValues) || !allowedValues.includes(cleanValue)) {
        throw new Error("INVALID_CART");
      }
      options[key] = cleanValue;
    }

    const attachments = (Array.isArray(rawItem?.attachments) ? rawItem.attachments : [])
      .slice(0, 5)
      .map(attachment => {
        const pathname = String(attachment?.pathname || "");
        if (!/^custom-orders\/reference-[A-Za-z0-9._-]+$/.test(pathname)) {
          throw new Error("INVALID_CART");
        }
        return { pathname, name: String(attachment?.name || "Reference photo").slice(0, 200) };
      });

    return {
      id: product.id,
      name: String(product.name),
      price: Number(product.price),
      quantity,
      options,
      attachments
    };
  });
}

function preferredDate(requestBody) {
  const value = String(requestBody?.cart?.requiredByDate || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function orderRows(items) {
  return items.map(item => {
    const details = Object.entries(item.options)
      .map(([key, value]) => `<li><strong>${escapeHtml(key.replaceAll("_", " "))}:</strong> ${escapeHtml(value)}</li>`)
      .join("");
    const photos = item.attachments.length
      ? `<p><strong>${item.attachments.length} private reference photo(s) attached to this email.</strong></p>`
      : "";
    return `<tr><td>${escapeHtml(item.name)}${details ? `<ul>${details}</ul>` : ""}${photos}</td><td>${item.quantity}</td><td>$${(item.price * item.quantity).toFixed(2)}</td></tr>`;
  }).join("");
}

async function privatePhotoAttachments(items) {
  const photos = items.flatMap(item => item.attachments || []);
  const attachments = [];

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const result = await get(photo.pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    if (result?.statusCode !== 200) continue;
    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    attachments.push({
      content: buffer.toString("base64"),
      filename: String(photo.name || `reference-photo-${index + 1}.jpg`).replace(/[^A-Za-z0-9._-]/g, "_")
    });
  }

  return attachments;
}

async function sendEmail(to, subject, html, attachments = [], idempotencyKey = "") {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL;
  if (!apiKey || !from || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {})
    },
    body: JSON.stringify({ from, to: [to], subject, html, ...(attachments.length ? { attachments } : {}) })
  });
  if (!response.ok) {
    console.error("Order email failed:", response.status, await response.text());
    return false;
  }
  return true;
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
    const items = validatedItems(req.body);
    const requiredByDate = preferredDate(req.body);
    const preferredDateLine = requiredByDate
      ? `<p><strong>Preferred date requested:</strong> ${escapeHtml(requiredByDate)} (not yet confirmed)</p>`
      : "<p><strong>Preferred date requested:</strong> None</p>";
    const expectedTotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
    if (
      capture.status !== "COMPLETED" ||
      capturedAmount?.currency_code !== CURRENCY ||
      Number(capturedAmount?.value) !== Number(expectedTotal.toFixed(2))
    ) {
      console.error("Unexpected PayPal capture response:", capture);
      return res.status(502).json({ error: "PayPal payment was not completed." });
    }

    const payerName = [capture.payer?.name?.given_name, capture.payer?.name?.surname]
      .filter(Boolean)
      .join(" ") || "Customer";
    const payerEmail = capture.payer?.email_address || "";
    const total = `$${expectedTotal.toFixed(2)} ${CURRENCY}`;
    const table = `<table cellpadding="8" cellspacing="0" border="1"><thead><tr><th>Product</th><th>Quantity</th><th>Total</th></tr></thead><tbody>${orderRows(items)}</tbody></table>`;
    const photoAttachments = await privatePhotoAttachments(items);

    const ownerEmailSent = await sendEmail(
      process.env.ORDER_NOTIFICATION_EMAIL,
      `New paid Velvet Charms order ${capture.id}`,
      `<h1>New paid order</h1><p><strong>PayPal order:</strong> ${escapeHtml(capture.id)}</p><p><strong>Customer:</strong> ${escapeHtml(payerName)} (${escapeHtml(payerEmail)})</p>${preferredDateLine}${table}<p><strong>Order total:</strong> ${total}</p>`,
      photoAttachments,
      `owner-order-${capture.id}`
    );

    const customerEmailSent = payerEmail
      ? await sendEmail(
          payerEmail,
          `Velvet Charms order confirmation ${capture.id}`,
          `<h1>Thank you for your order!</h1><p>Hello ${escapeHtml(payerName)},</p><p>Your payment has been confirmed and your place in our production schedule is reserved.</p>${preferredDateLine}<p>Within 1–2 business days, we will confirm your production window and estimated dispatch date. Any preferred date remains unconfirmed until we review the creation and our current schedule.</p>${table}<p><strong>Order total:</strong> ${total}</p><p>We will contact you if any customization detail needs clarification.</p>`,
          [],
          `customer-order-${capture.id}`
        )
      : false;

    return res.status(200).json({
      status: capture.status,
      orderID: capture.id,
      captureID: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      ownerEmailSent,
      customerEmailSent
    });
  } catch (error) {
    console.error("Capture order error:", error);

    if (error.message === "PAYPAL_NOT_CONFIGURED") {
      return res.status(503).json({ error: "PayPal is not configured yet." });
    }

    if (error.message === "INVALID_CART") {
      return res.status(400).json({ error: "The cart is empty or invalid." });
    }

    return res.status(500).json({ error: "Payment confirmation failed." });
  }
}
