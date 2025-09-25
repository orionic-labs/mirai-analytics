# api/chatbot.py
from quart import Blueprint, jsonify, request
from backend.pipelines.chatbot import graph as chatbot_graph
import ast
from langchain_core.messages import HumanMessage

bp = Blueprint("chatbot", __name__)


@bp.post("/chatbot/send_message_chat")
async def send_message_chat():
    try:
        pass
    except Exception as e:
        
        
        return jsonify({"error": str(e)}), 500