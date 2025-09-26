# scripts/get_stocks_statistic.py
import yfinance as yf
from sqlalchemy import text
from backend.db.session import SessionLocal
import asyncio


async def get_current_portfolio():
    results = []

    async with SessionLocal() as session:
        query = text("""
            SELECT a.label, a.ticker, al.allocation_percent
            FROM assets a
            JOIN allocation al ON al.asset_ticker = a.ticker
            WHERE al.allocation_percent > 0
        """)
        rows = (await session.execute(query)).mappings().all()

        for row in rows:
            ticker_symbol = row["ticker"]
            company = row["label"]
            allocation_percent = float(row["allocation_percent"])

            try:
                ticker = yf.Ticker(ticker_symbol)

                hist_7d = await asyncio.to_thread(ticker.history, period="7d")

                if hist_7d.empty:
                    results.append({
                        "company": company,
                        "ticker": ticker_symbol,
                        "allocation_percent": allocation_percent,
                        "error": "No market data found"
                    })
                    continue

                last_price = float(hist_7d["Close"].iloc[-1])

                change_7d = ((last_price - float(hist_7d["Close"].iloc[0])) / float(hist_7d["Close"].iloc[0])) * 100

                trend = "up" if change_7d > 0 else "down" if change_7d < 0 else "neutral"

                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "last_price": round(last_price, 2),
                    "allocation_percent": allocation_percent,
                    "change_7d": change_7d,
                    "trend": trend
                })

            except Exception as e:
                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "allocation_percent": allocation_percent,
                    "error": str(e)
                })

    return results



async def get_portfolio_status():
    results = []

    async with SessionLocal() as session:
        query = text("""
            SELECT a.label, a.ticker, al.allocation_percent
            FROM assets a
            JOIN allocation al ON al.asset_ticker = a.ticker
            WHERE al.allocation_percent > 0
        """)
        rows = (await session.execute(query)).mappings().all()

        for row in rows:
            ticker_symbol = row["ticker"]
            company = row["label"]
            allocation_percent = float(row["allocation_percent"])

            try:
                ticker = yf.Ticker(ticker_symbol)

                hist_7d = await asyncio.to_thread(ticker.history, period="7d")
                hist_1m = await asyncio.to_thread(ticker.history, period="1mo")
                hist_3m = await asyncio.to_thread(ticker.history, period="3mo")

                if hist_7d.empty:
                    results.append({
                        "company": company,
                        "ticker": ticker_symbol,
                        "allocation_percent": allocation_percent,
                        "error": "No market data found"
                    })
                    continue

                last_price = float(hist_7d["Close"].iloc[-1])

                change_7d = ((last_price - float(hist_7d["Close"].iloc[0])) / float(hist_7d["Close"].iloc[0])) * 100
                change_1m = ((float(hist_1m["Close"].iloc[-1]) - float(hist_1m["Close"].iloc[0])) / float(hist_1m["Close"].iloc[0])) * 100 if not hist_1m.empty else None
                change_3m = ((float(hist_3m["Close"].iloc[-1]) - float(hist_3m["Close"].iloc[0])) / float(hist_3m["Close"].iloc[0])) * 100 if not hist_3m.empty else None

                trend = "up" if change_7d > 0 else "down" if change_7d < 0 else "neutral"

                info = await asyncio.to_thread(ticker.get_info)
                market_cap = float(info.get("marketCap")) if info.get("marketCap") else None
                pe_ratio = float(info.get("trailingPE")) if info.get("trailingPE") else None
                dividend_yield = float(info.get("dividendYield")) if info.get("dividendYield") else None
                avg_volume = int(info.get("averageVolume")) if info.get("averageVolume") else None

                high_risk = bool(change_1m is not None and change_1m < -10)

                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "allocation_percent": allocation_percent,
                    "last_price": round(last_price, 2),
                    "trend_7d": trend,
                    "change_7d_pct": round(float(change_7d), 2),
                    "change_1m_pct": round(float(change_1m), 2) if change_1m is not None else None,
                    "change_3m_pct": round(float(change_3m), 2) if change_3m is not None else None,
                    "market_cap": market_cap,
                    "pe_ratio": pe_ratio,
                    "dividend_yield": dividend_yield,
                    "avg_volume": avg_volume,
                    "high_risk": high_risk,
                })

            except Exception as e:
                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "allocation_percent": allocation_percent,
                    "error": str(e)
                })

    return results


async def get_all_assets_status():
    results = []

    async with SessionLocal() as session:
        query = text("""
            SELECT a.label, a.ticker,
                   COALESCE(al.allocation_percent, 0) AS allocation_percent
            FROM assets a
            LEFT JOIN allocation al ON al.asset_ticker = a.ticker
        """)
        rows = (await session.execute(query)).mappings().all()

        for row in rows:
            ticker_symbol = row["ticker"]
            company = row["label"]
            allocation_percent = float(row["allocation_percent"] or 0)

            try:
                ticker = yf.Ticker(ticker_symbol)

                hist_7d = await asyncio.to_thread(ticker.history, period="7d")
                hist_1m = await asyncio.to_thread(ticker.history, period="1mo")
                hist_3m = await asyncio.to_thread(ticker.history, period="3mo")

                if hist_7d.empty:
                    results.append({
                        "company": company,
                        "ticker": ticker_symbol,
                        "allocation_percent": allocation_percent,
                        "error": "No market data found"
                    })
                    continue

                last_price = float(hist_7d["Close"].iloc[-1])
                change_7d = ((last_price - float(hist_7d["Close"].iloc[0])) / float(hist_7d["Close"].iloc[0])) * 100
                change_1m = ((float(hist_1m["Close"].iloc[-1]) - float(hist_1m["Close"].iloc[0])) / float(hist_1m["Close"].iloc[0])) * 100 if not hist_1m.empty else None
                change_3m = ((float(hist_3m["Close"].iloc[-1]) - float(hist_3m["Close"].iloc[0])) / float(hist_3m["Close"].iloc[0])) * 100 if not hist_3m.empty else None

                trend = "up" if change_7d > 0 else "down" if change_7d < 0 else "neutral"

                info = await asyncio.to_thread(ticker.get_info)
                market_cap = float(info.get("marketCap")) if info.get("marketCap") else None
                pe_ratio = float(info.get("trailingPE")) if info.get("trailingPE") else None
                dividend_yield = float(info.get("dividendYield")) if info.get("dividendYield") else None
                avg_volume = int(info.get("averageVolume")) if info.get("averageVolume") else None

                high_risk = bool(change_1m is not None and change_1m < -10)

                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "allocation_percent": allocation_percent,
                    "last_price": round(last_price, 2),
                    "trend_7d": trend,
                    "change_7d_pct": round(float(change_7d), 2),
                    "change_1m_pct": round(float(change_1m), 2) if change_1m is not None else None,
                    "change_3m_pct": round(float(change_3m), 2) if change_3m is not None else None,
                    "market_cap": market_cap,
                    "pe_ratio": pe_ratio,
                    "dividend_yield": dividend_yield,
                    "avg_volume": avg_volume,
                    "high_risk": high_risk,
                })

            except Exception as e:
                results.append({
                    "company": company,
                    "ticker": ticker_symbol,
                    "allocation_percent": allocation_percent,
                    "error": str(e)
                })

    return results


if __name__ == "__main__":
    print(asyncio.run(get_portfolio_status()))
