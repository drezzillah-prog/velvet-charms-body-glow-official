const COUNTRY_CURRENCY = {
  RO: "RON",
  AT: "EUR", BE: "EUR", HR: "EUR", CY: "EUR", EE: "EUR", FI: "EUR",
  FR: "EUR", DE: "EUR", GR: "EUR", IE: "EUR", IT: "EUR", LV: "EUR",
  LT: "EUR", LU: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SK: "EUR",
  SI: "EUR", ES: "EUR",
  GB: "GBP", US: "USD", CA: "CAD", AU: "AUD"
};

const SUPPORTED = ["USD", "EUR", "RON", "GBP", "CAD", "AUD"];

function parseEcbRates(xml) {
  const eurRates = { EUR: 1 };
  for (const match of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([0-9.]+)['"]/g)) {
    eurRates[match[1]] = Number(match[2]);
  }

  if (!Number.isFinite(eurRates.USD)) throw new Error("ECB USD rate unavailable");

  return Object.fromEntries(
    SUPPORTED.map(currency => [
      currency,
      currency === "USD" ? 1 : eurRates[currency] / eurRates.USD
    ]).filter(([, rate]) => Number.isFinite(rate))
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const country = String(req.headers["x-vercel-ip-country"] || "").toUpperCase();
  const suggestedCurrency = COUNTRY_CURRENCY[country] || "USD";

  try {
    const response = await fetch(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
      { headers: { Accept: "application/xml" } }
    );
    if (!response.ok) throw new Error(`ECB request failed: ${response.status}`);

    const rates = parseEcbRates(await response.text());
    res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
    return res.status(200).json({
      base: "USD",
      country,
      suggestedCurrency: rates[suggestedCurrency] ? suggestedCurrency : "USD",
      rates,
      source: "European Central Bank",
      estimated: true
    });
  } catch (error) {
    console.error("Currency rates error:", error);
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({
      base: "USD",
      country,
      suggestedCurrency: "USD",
      rates: { USD: 1 },
      source: "USD fallback",
      estimated: true
    });
  }
}
