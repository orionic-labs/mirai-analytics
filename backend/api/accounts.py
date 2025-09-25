# api/accounts.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from datetime import datetime, timezone
import uuid
from backend.security.crypto import encrypt_secret

bp = Blueprint("accounts", __name__)


# ---- Accounts
@bp.get("/accounts/list")
async def list_accounts():
    try: pass
    except Exception as e:
        print(f"Error fetching accounts: {e}")
        return jsonify({"error": str(e)}), 500


@bp.post("/accounts/delete")
async def delete_account():
    try:
        pass
    except Exception as e:
        print(f"Error deleting account: {e}")
        return jsonify({"error": str(e)}), 500


@bp.post("/accounts/add")
async def add_account():
    try:
        pass
    except Exception as e:
        print(f"Error adding account: {e}")
        return jsonify({"error": str(e)}), 500