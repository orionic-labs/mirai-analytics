# api/news.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from backend.schemas import AnalyzeNewsRequest, ImportancePayload

bp = Blueprint("news", __name__)


@bp.get("/insights")
async def list_news():
    try:
        async with SessionLocal() as session:
            query = text(
                """
                SELECT asset_ticker, allocation_percent
                FROM allocation

            """
            )
            rows = (await session.execute(query)).mappings().all()

            items = []
            for row in rows:
                
            

                items.append(
                    {
                        "asset_ticker": str(row["asset_ticker"]),
                        "allocation_percent": float(row["allocation_percent"]),
                    }
                )
            return jsonify(items)
    except Exception:
        return jsonify({"error": "Failed to fetch news"}), 500

