# api/sources.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from datetime import datetime, timezone
import json
import uuid

bp = Blueprint("sources", __name__)


@bp.get("/sources/list")
async def list_sources():
    try:
        pass
    except Exception as e:
        print(f"Error fetching sources: {e}")
        return jsonify({"error": str(e)}), 500


@bp.post("/sources/add")
async def add_source():
    try:
        pass
    except Exception as e:
        print(f"Error adding source: {e}")
        return jsonify({"error": str(e)}), 500