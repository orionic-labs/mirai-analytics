# api/clients.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from typing import Dict, Any
from backend.schemas import AddClientPayload, UpdatePortfolioPayload
from backend.db.models import Client, Allocation

bp = Blueprint("clients", __name__)



@bp.get("/clients/list")
async def list_clients():
    try:
        pass
    except Exception as e:
       
        return jsonify({"error": "Failed to fetch clients"}), 500


@bp.post("/clients/add_client")
async def add_client():
    
    try:
        pass
    except Exception as e:
       
        return jsonify({"error": "Failed to add client"}), 500

