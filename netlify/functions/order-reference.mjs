import { createHmac, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

function signingSecret() {
  return String(process.env.ORDER_REFERENCE_SECRET || "");
}

function expectedSignature(pathname, exp, secret) {
  return createHmac("sha256", secret).update(`${pathname}.${exp}`).digest("hex");
}

export default async function handler(request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });

  const url = new URL(request.url);
  const pathname = String(url.searchParams.get("pathname") || "");
  const exp = String(url.searchParams.get("exp") || "");
  const sig = String(url.searchParams.get("sig") || "");
  const secret = signingSecret();

  if (!secret || !/^custom-orders\/reference-[A-Za-z0-9._-]+$/.test(pathname) || !/^\d{13}$/.test(exp) || !/^[a-f0-9]{64}$/.test(sig)) {
    return new Response("Invalid private reference link.", { status: 403 });
  }
  if (Date.now() > Number(exp)) return new Response("This private reference link has expired.", { status: 410 });

  const expected = expectedSignature(pathname, exp, secret);
  const valid = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  if (!valid) return new Response("Invalid private reference link.", { status: 403 });

  try {
    const store = getStore({ name: "velvet-private-references", consistency: "strong" });
    const entry = await store.getWithMetadata(pathname, { type: "arrayBuffer", consistency: "strong" });
    if (!entry?.data) return new Response("Reference image not found.", { status: 404 });
    return new Response(entry.data, {
      status: 200,
      headers: {
        "Content-Type": entry.metadata?.contentType || "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline"
      }
    });
  } catch (error) {
    console.error("Netlify seller reference read error:", error);
    return new Response("Reference image not found.", { status: 404 });
  }
}

export const config = { path: "/api/order-reference" };
