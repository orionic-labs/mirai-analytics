/**
 * NOTE: This service now uses APIs that require free API keys.
 * Please sign up and add your keys below.
 *
 * - Finnhub (Stocks, Indices, etc.): https://finnhub.io/register
 */
// To use this service, you need to get a free API key from Finnhub.
const FINNHUB_API_KEY = 'd3b7k89r01qu573pu45gd3b7k89r01qu573pu460';

if (FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
  console.warn('Finnhub API key is not configured. Market data will be limited.');
}

/**
 * The unified quote type returned by the service.
 */
export type Quote = {
  symbol: string; // The original requested symbol (e.g., ^GSPC, EURUSD=X, BTC-USD)
  name: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency?: string;
  ts: number;
  provider: 'finnhub' | 'coincap' | 'frankfurter';
};

// --- API Response Types ---
type FinnhubQuoteResponse = {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
};

type CoinCapAsset = {
  id: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
};

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: { [currency: string]: number };
};

/** ---------- Primary Provider: Finnhub (Stocks, Indices, ETFs) ---------- */

// Maps common Yahoo tickers to their most liquid ETF proxies for Finnhub
const FINNHUB_MAP: Record<string, { symbol: string; name: string }> = {
  '^GSPC': { symbol: 'SPY', name: 'S&P 500 (SPY proxy)' },
  '^NDX': { symbol: 'QQQ', name: 'Nasdaq 100 (QQQ proxy)' },
  '^DJI': { symbol: 'DIA', name: 'Dow Jones (DIA proxy)' },
  'GC=F': { symbol: 'GLD', name: 'Gold (GLD proxy)' },
  'CL=F': { symbol: 'USO', name: 'WTI Crude (USO proxy)' },
};

async function fetchFinnhubQuotes(symbols: string[]): Promise<Quote[]> {
  const stockSymbols = symbols.filter(
    (s) => /^[A-Z0-9\.\^=/-]+$/.test(s) && !/^[A-Z]{6}=X$/.test(s) && !COINCAP_IDS[s]
  );
  if (!stockSymbols.length || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') return [];

  const promises = stockSymbols.map(async (originalSymbol) => {
    const mapping = FINNHUB_MAP[originalSymbol];
    const apiSymbol = mapping?.symbol || originalSymbol;
    const name = mapping?.name || originalSymbol;

    const url = `https://finnhub.io/api/v1/quote?symbol=${apiSymbol}&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Finnhub API error for ${apiSymbol}: ${res.status}`);

    const json: FinnhubQuoteResponse = await res.json();
    if (json.c == null || json.c === 0) return null; // No data for this symbol

    return {
      symbol: originalSymbol,
      name,
      price: json.c,
      change: json.d,
      changePct: json.dp,
      currency: 'USD', // Finnhub quotes are typically in USD
      ts: json.t * 1000,
      provider: 'finnhub' as const,
    };
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter(
      (res): res is PromiseFulfilledResult<Quote> =>
        res.status === 'fulfilled' && res.value !== null
    )
    .map((res) => res.value);
}

/** ---------- Fallback Provider 1: CoinCap (Cryptocurrencies) ---------- */

/** ---------- Fallback Provider 1: CoinCap (Cryptocurrencies) ---------- */

const COINCAP_IDS: Record<string, { id: string; name: string }> = {
  'BTC-USD': { id: 'bitcoin', name: 'Bitcoin' },
  'ETH-USD': { id: 'ethereum', name: 'Ethereum' },
  'DOGE-USD': { id: 'dogecoin', name: 'Dogecoin' },
};

async function fetchCoinCapQuotes(symbols: string[]): Promise<Quote[]> {
  const cryptoIds = symbols.map((s) => COINCAP_IDS[s]?.id).filter(Boolean);
  if (!cryptoIds.length) return [];

  const url = `https://api.coincap.io/v2/assets?ids=${cryptoIds.join(',')}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const json: { data: CoinCapAsset[] } = await res.json();
  const priceMap = new Map(json.data.map((asset) => [asset.id, asset]));

  const out: Quote[] = [];
  for (const [symbol, { id, name }] of Object.entries(COINCAP_IDS)) {
    const data = priceMap.get(id);
    if (!data) continue;

    // ----- FIX START -----
    // Added robust parsing and corrected the change calculation.
    const priceNum = parseFloat(data.priceUsd);
    const changePctNum = parseFloat(data.changePercent24Hr);

    const price = Number.isFinite(priceNum) ? priceNum : null;
    const changePct = Number.isFinite(changePctNum) ? changePctNum : null;
    let change: number | null = null;

    // The correct way to calculate the absolute change from the current price
    // and the 24hr percentage change.
    if (price !== null && changePct !== null) {
      const openingPrice = price / (1 + changePct / 100);
      change = price - openingPrice;
    }

    out.push({
      symbol,
      name,
      price,
      change,
      changePct,
      currency: 'USD',
      ts: Date.now(),
      provider: 'coincap' as const,
    });
    // ----- FIX END -----
  }
  return out;
}

/** ---------- Fallback Provider 2: Frankfurter (Forex) ---------- */

function parseFx(ySymbol: string): { base: string; quote: string } | null {
  const m = /^([A-Z]{3})([A-Z]{3})=X$/.exec(ySymbol);
  if (!m) return null;
  return { base: m[1], quote: m[2] };
}

async function fetchFrankfurterQuotes(symbols: string[]): Promise<Quote[]> {
  const fxPairs = symbols.map((s) => ({ original: s, parsed: parseFx(s) })).filter((p) => p.parsed);
  if (!fxPairs.length) return [];

  // Group by base currency to make fewer API calls
  const groupedByBase: Record<string, { original: string; quote: string }[]> = {};
  for (const { original, parsed } of fxPairs) {
    if (!parsed) continue;
    if (!groupedByBase[parsed.base]) groupedByBase[parsed.base] = [];
    groupedByBase[parsed.base].push({ original, quote: parsed.quote });
  }

  const promises = Object.entries(groupedByBase).map(async ([base, targets]) => {
    const quotes = targets.map((t) => t.quote).join(',');
    const url = `https://api.frankfurter.app/latest?from=${base}&to=${quotes}`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const json: FrankfurterResponse = await res.json();
    return targets.map(({ original, quote }) => {
      const price = json.rates[quote] ?? null;
      return {
        symbol: original,
        name: `${base}/${quote}`,
        price,
        change: null, // This API doesn't provide change data
        changePct: null,
        currency: quote,
        ts: new Date(json.date).getTime(),
        provider: 'frankfurter' as const,
      };
    });
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter((res): res is PromiseFulfilledResult<Quote[]> => res.status === 'fulfilled')
    .flatMap((res) => res.value);
}

/** ---------- Public API: Fetch from all sources in parallel ---------- */
export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  if (!symbols || symbols.length === 0) {
    return [];
  }

  // Run all providers in parallel and gracefully handle failures.
  const allProviderPromises = [
    fetchFinnhubQuotes(symbols),
    fetchCoinCapQuotes(symbols),
    fetchFrankfurterQuotes(symbols),
  ];

  const results = await Promise.allSettled(allProviderPromises);

  const successfulQuotes = results
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => (result as PromiseFulfilledResult<Quote[]>).value);

  // De-duplicate results, ensuring only one quote per symbol is returned.
  // The order of providers in `allProviderPromises` determines priority.
  const finalQuotes: Quote[] = [];
  const seenSymbols = new Set<string>();

  for (const quote of successfulQuotes) {
    if (!seenSymbols.has(quote.symbol)) {
      finalQuotes.push(quote);
      seenSymbols.add(quote.symbol);
    }
  }

  // If all providers failed for a non-empty request, throw an error.
  if (symbols.length > 0 && finalQuotes.length === 0) {
    const firstError = results.find((result) => result.status === 'rejected');
    if (firstError) {
      throw (firstError as PromiseRejectedResult).reason;
    }
    throw new Error('Failed to fetch market data from all available providers.');
  }

  return finalQuotes;
}
