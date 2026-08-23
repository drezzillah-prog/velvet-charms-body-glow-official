import { createHmac, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";
import { get } from "@vercel/blob";

function signingSecret() {
  return String(process.env.ORDER_REFERENCE_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "");
}

function expectedSignature(pathname, exp, secret) {
  return createHmac("sha256", secret).update(`${pathname}.${exp}`).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pathname = String(req.query?.pathname || "");
  const exp = String(req.query?.exp || "");
  const sig = String(req.query?.sig || "");
  const secret = signingSecret();

  if (!secret || !/^custom-orders\/reference-[A-Za-z0-9._-]+$/.test(pathname) || !/^\d{13}$/.test(exp) || !/^[a-f0-9]{64}$/.test(sig)) {
    return res.status(403).send("Invalid private reference link.");
  }

  if (Date.now() > Number(exp)) {
    return res.status(410).send("This private reference link has expired.");
  }

  const expected = expectedSignature(pathname, exp, secret);
  const valid = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  if (!valid) return res.status(403).send("Invalid private reference link.");

  try {
    const result = await get(pathname, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!result || result.statusCode !== 200 || !result.stream) return res.status(404).send("Reference image not found.");

    res.setHeader("Content-Type", result.blob?.contentType || "application/octet-stream");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", "inline");
    const stream = typeof Readable.fromWeb === "function" ? Readable.fromWeb(result.stream) : result.stream;
    stream.pipe(res);
  } catch (error) {
    console.error("Seller reference read error:", error);
    return res.status(404).send("Reference image not found.");
  }
}
