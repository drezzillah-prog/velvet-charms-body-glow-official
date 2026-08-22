import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import formidable from "formidable";

export const config = {
  api: { bodyParser: false }
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024;

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
