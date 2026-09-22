const ROUTES = new Map([
  ["/api/create-order", "../../api/create-order.js"],
  ["/api/capture-order", "../../api/capture-order.js"],
  ["/api/contact", "../../api/contact.js"],
  ["/api/currency", "../../api/currency.js"],
  ["/api/ping", "../../api/ping.js"]
]);

function headersObject(request, context) {
  const headers = Object.fromEntries(request.headers.entries());
  const url = new URL(request.url);
  headers.host ||= url.host;
  headers["x-forwarded-host"] ||= url.host;
  if (context?.geo?.country?.code) headers["x-vercel-ip-country"] ||= context.geo.country.code;
  if (context?.geo?.timezone) headers["x-vercel-ip-timezone"] ||= context.geo.timezone;
  if (context?.ip) headers["x-forwarded-for"] ||= context.ip;
  return headers;
}

async function requestBody(request) {
  if (["GET", "HEAD"].includes(request.method)) return undefined;
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    try { return await request.json(); } catch { return {}; }
  }
  try { return await request.text(); } catch { return ""; }
}

function createResponseShim() {
  let statusCode = 200;
  let payload = "";
  let ended = false;
  const headers = new Headers();

  const res = {
    headersSent: false,
    setHeader(name, value) { headers.set(name, String(value)); return res; },
    getHeader(name) { return headers.get(name); },
    status(code) { statusCode = code; return res; },
    json(value) {
      headers.set("Content-Type", "application/json; charset=utf-8");
      payload = JSON.stringify(value);
      ended = true;
      res.headersSent = true;
      return res;
    },
    send(value = "") {
      payload = typeof value === "string" || value instanceof Uint8Array ? value : JSON.stringify(value);
      ended = true;
      res.headersSent = true;
      return res;
    },
    end(value = "") {
      payload = value;
      ended = true;
      res.headersSent = true;
      return res;
    },
    destroy() { ended = true; }
  };

  return {
    res,
    response() {
      if (!ended && statusCode === 204) return new Response(null, { status: statusCode, headers });
      return new Response(payload ?? "", { status: statusCode, headers });
    }
  };
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const modulePath = ROUTES.get(url.pathname);
  if (!modulePath) return new Response("Not found", { status: 404 });

  const module = await import(modulePath);
  const legacyHandler = module.default || module;
  const query = Object.fromEntries(url.searchParams.entries());
  const req = {
    method: request.method,
    headers: headersObject(request, context),
    query,
    body: await requestBody(request),
    socket: { remoteAddress: context?.ip || "" }
  };

  const shim = createResponseShim();
  await legacyHandler(req, shim.res);
  return shim.response();
}

export const config = {
  path: ["/api/create-order", "/api/capture-order", "/api/contact", "/api/currency", "/api/ping"]
};
