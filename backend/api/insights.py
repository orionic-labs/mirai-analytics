from quart import Blueprint

bp = Blueprint("insights", __name__)

@bp.get("/insights")
async def list_insights():
    return {"message": "Insights endpoint works!"}
