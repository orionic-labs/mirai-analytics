# app/register_blueprints.py
from quart import Quart
from backend.api.health import bp as health_bp
from backend.api.news import bp as news_bp
from backend.api.portfolio import bp as portfolio_bp
from backend.api.insights import bp as insights_bp
from backend.api.chatbot import bp as chatbot_bp



def register_blueprints(app: Quart) -> None:
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(news_bp, url_prefix="/api")
    app.register_blueprint(portfolio_bp, url_prefix="/api")
    app.register_blueprint(insights_bp, url_prefix="/api")
    app.register_blueprint(chatbot_bp, url_prefix="/api")
