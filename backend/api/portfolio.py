# api/portfolio.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from backend.schemas import AnalyzeNewsRequest, ImportancePayload
from backend.scripts.get_stocks_statistic import get_portfolio_status, get_all_assets_status, get_current_portfolio

bp = Blueprint("portfolio", __name__)


@bp.get("/portfolio/current_status")
async def portfolio_current_status():
    try:
        portfolio_data = await get_current_portfolio()

        return jsonify({
            "portfolio": portfolio_data,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.get("/portfolio/analysis")
async def portfolio_analysis():
    try:
        portfolio_data = await get_portfolio_status()

        return jsonify({
            "portfolio": portfolio_data,
            "instructions_for_llm": """
        You are a financial assistant.

        TASKS:
        1. For each asset in the portfolio:
           - Say how much % of the portfolio is allocated to it right now.
           - Mention the current price and trend (7d, 1m, 3m).
           - Add 1–2 simple sentences in a conversational style about how this asset is doing (e.g., "NVIDIA is up 5% this month and takes 40% of your portfolio – it's a big driver of performance.").

        2. For the overall portfolio:
           - Summarize how the portfolio is performing (up, down, neutral).
           - Point out risky assets (those marked 'high_risk': true).
           - Highlight if the portfolio is concentrated (e.g., too much weight in one company).
           - Give a short, friendly recommendation in plain words (e.g., "Might be worth rebalancing a bit from tech into more stable assets.").

        STYLE:
        - Be short, conversational, and practical.
        - Imagine you're chatting with a friend about their investments.
        """

        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.get("/portfolio/recommendations")
async def portfolio_recommendations():
    try:
        portfolio_data = await get_all_assets_status()

        return jsonify({
            "portfolio": portfolio_data,
            "instructions_for_llm": """
            You are a financial assistant.

            TASKS:
            1. For each asset in the list:
               - If allocation_percent > 0: explain briefly how this part of the portfolio is performing (trend, 7d/1m/3m changes, current price).
               - Mention how much % is allocated to it.
               - Add 1–2 conversational sentences about whether this allocation looks good or might need adjustment.
               - If allocation_percent = 0: just note if the asset looks strong or weak right now (based on trend and metrics) and whether it could be worth adding to the portfolio. 
               DO NOT CHOOSE ALL OF THEM, JUST WHICH ARE THE MOST INTERESTING BASED ON STATISTIC(up or down)

            2. For the overall portfolio:
               - Identify allocations that seem too risky (look at 'high_risk': true) or too concentrated (too high allocation_percent in one place).
               - Point out potentially better-performing unallocated assets that could diversify or improve performance.
               - Give a short, friendly recommendation for rebalancing (e.g., "Maybe reduce exposure to X and put more into Y or Z.").

            STYLE:
            - Be short, conversational, and practical.
            - Imagine you're a friend giving down-to-earth advice about someone's portfolio.
            - Focus on optimization and clear suggestions: which assets to increase, decrease, or newly invest in.

        """

        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.post("/portfolio/update_allocation")
async def update_allocation():
    try:
        data = await request.get_json()
        ticker = data.get("ticker")
        new_percent = data.get("allocation_percent")

        if ticker is None or new_percent is None:
            return jsonify({"error": "ticker and allocation_percent are required"}), 400

        async with SessionLocal() as session:
            result = await session.execute(
                text("""
                    UPDATE allocation
                    SET allocation_percent = :percent
                    WHERE asset_ticker = :ticker
                    RETURNING asset_ticker
                """),
                {"percent": new_percent, "ticker": ticker}
            )
            updated = result.mappings().first()
            if not updated:
                return jsonify({"error": f"No allocation row found for ticker {ticker}"}), 404

            await session.commit()

        return jsonify({
            "ok": True,
            "message": f"Allocation for {ticker} updated to {new_percent}%"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

