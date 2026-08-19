const COUNTRY_CURRENCY = {
  AD:"EUR", AE:"AED", AF:"AFN", AL:"ALL", AM:"AMD", AO:"AOA", AR:"ARS", AT:"EUR",
  AU:"AUD", AZ:"AZN", BA:"BAM", BD:"BDT", BE:"EUR", BG:"BGN", BH:"BHD", BR:"BRL",
  BY:"BYN", CA:"CAD", CH:"CHF", CL:"CLP", CN:"CNY", CO:"COP", CR:"CRC", CY:"EUR",
  CZ:"CZK", DE:"EUR", DK:"DKK", DO:"DOP", DZ:"DZD", EC:"USD", EE:"EUR", EG:"EGP",
  ES:"EUR", FI:"EUR", FR:"EUR", GB:"GBP", GE:"GEL", GR:"EUR", GT:"GTQ", HK:"HKD",
  HR:"EUR", HU:"HUF", ID:"IDR", IE:"EUR", IL:"ILS", IN:"INR", IS:"ISK", IT:"EUR",
  JP:"JPY", KE:"KES", KR:"KRW", KW:"KWD", KZ:"KZT", LI:"CHF", LK:"LKR", LT:"EUR",
  LU:"EUR", LV:"EUR", MA:"MAD", MD:"MDL", ME:"EUR", MK:"MKD", MT:"EUR", MX:"MXN",
  MY:"MYR", NG:"NGN", NL:"EUR", NO:"NOK", NP:"NPR", NZ:"NZD", PA:"USD", PE:"PEN",
  PH:"PHP", PK:"PKR", PL:"PLN", PT:"EUR", QA:"QAR", RO:"RON", RS:"RSD", RU:"RUB",
  SA:"SAR", SE:"SEK", SG:"SGD", SI:"EUR", SK:"EUR", TH:"THB", TN:"TND", TR:"TRY",
  TW:"TWD", UA:"UAH", US:"USD", UY:"UYU", VN:"VND", ZA:"ZAR"
};

function parseEcbRates(xml) {
  const eurRates = { EUR: 1 };
  for (const match of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([0-9.]+)['"]/g)) {
    eurRates[match[1]] = Number(match[2]);
  }
  if (!Number.isFinite(eurRates.USD)) throw new Error("ECB USD rate unavailable");

  return Object.fromEntries(
    Object.entries(eurRates)
      .map(([currency, rate]) => [currency, currency === "USD" ? 1 : rate / eurRates.USD])
      .filter(([, rate]) => Number.isFinite(rate))
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const country = String(req.headers["x-vercel-ip-country"] || "").toUpperCase();
  const localCurrency = COUNTRY_CURRENCY[country] || "USD";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Exchange rate request failed: ${response.status}`);

    const data = await response.json();
    if (data.result !== "success" || !data.rates?.USD) {
      throw new Error("Exchange rate response unavailable");
    }

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=172800");
    return res.status(200).json({
      base: "USD",
      country,
      currency: data.rates[localCurrency] ? localCurrency : "USD",
      rates: data.rates,
      source: "ExchangeRate-API",
      estimated: true
    });
  } catch (error) {
    console.error("Currency rates error:", error);
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({
      base: "USD",
      country,
      currency: "USD",
      rates: { USD: 1 },
      source: "USD fallback",
      estimated: true
    });
  }
}
