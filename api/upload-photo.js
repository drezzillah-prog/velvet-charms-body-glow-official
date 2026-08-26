import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import formidable from "formidable";

export const config = {
  api: { bodyParser: false }
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const UPLOAD_WINDOW_MS = 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 20;
const uploadBuckets = globalThis.__VELVET_BODY_GLOW_UPLOAD_BUCKETS || new Map();
globalThis.__VELVET_BODY_GLOW_UPLOAD_BUCKETS = uploadBuckets;

function sameOriginRequest(req) {
  const origin = String(req.headers?.origin || "").trim();
  if (!origin) return true;
  const forwardedHost = String(req.headers?.["x-forwarded-host"] || "").split(",")[0].trim();
  const host = (forwardedHost || String(req.headers?.host || "")).toLowerCase();
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function clientKey(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

function allowUpload(req) {
  const now = Date.now();
  const key = clientKey(req);
  const bucket = uploadBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= UPLOAD_WINDOW_MS) {
    uploadBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= MAX_UPLOADS_PER_WINDOW) return false;
  bucket.count += 1;
  if (uploadBuckets.size > 1000) {
    for (const [storedKey, stored] of uploadBuckets) {
      if (now - stored.startedAt >= UPLOAD_WINDOW_MS) uploadBuckets.delete(storedKey);
    }
  }
  return true;
}

function parseForm(req) {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    maxFileSize: MAX_FILE_SIZE,
    allowEmptyFiles: false,
    filter: part => part.name === "photo" && ALLOWED_TYPES.has(part.mimetype)
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!sameOriginRequest(req)) {
    return res.status(403).json({ error: "Cross-site uploads are not allowed." });
  }
  if (!allowUpload(req)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many uploads. Please wait a moment and try again." });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({ error: "Photo storage is not configured yet." });
    }

    const { files } = await parseForm(req);
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
    if (!photo || !ALLOWED_TYPES.has(photo.mimetype) || photo.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "Please upload a JPG, PNG or WEBP photo under 4 MB." });
    }

    const extension = photo.mimetype === "image/png" ? "png" : photo.mimetype === "image/webp" ? "webp" : "jpg";
    const data = await readFile(photo.filepath);
    const blob = await put(`custom-orders/reference-${Date.now()}.${extension}`, data, {
      access: "private",
      addRandomSuffix: true,
      contentType: photo.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json({ pathname: blob.pathname });
  } catch (error) {
    console.error("Photo upload error:", error);
    return res.status(400).json({ error: "The photo could not be uploaded. Please try again." });
  }
}
