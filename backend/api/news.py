# api/news.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from backend.schemas import AnalyzeNewsRequest, ImportancePayload

bp = Blueprint("news", __name__)


@bp.get("/news/list")
async def list_news():
    try:
        pass
    except Exception:
        return jsonify({"error": "Failed to fetch news"}), 500


@bp.post("/news/importance")
async def set_importance():
    
    try:
       pass
    except Exception:
        return jsonify({"error": "Failed to update importance"}), 500

