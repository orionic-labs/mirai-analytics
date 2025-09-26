import os
import operator
import anthropic
import asyncio
from typing import Annotated
from dotenv import load_dotenv
from sqlalchemy import text
from backend.db.session import SessionLocal
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, START, END

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=API_KEY)

class ChatState(dict):
    messages: Annotated[list[BaseMessage], operator.add]


async def get_latest_news(n: int = 7):
    async with SessionLocal() as session:
        result = await session.execute(
            text("""
                SELECT title, summary
                FROM articles
                ORDER BY published_at DESC
                LIMIT :n
            """),
            {"n": n}
        )
        rows = result.mappings().all()
        return [{"title": r["title"], "summary": r["summary"]} for r in rows]

def user_input(state: ChatState) -> ChatState:
    return state

async def rag_call(state: ChatState) -> ChatState:
    user_msg = state["messages"][-1].content

    news_items = await get_latest_news(7)
    news_text = "\n\n".join([f"- {n['title']}: {n['summary']}" for n in news_items])

    prompt = f"""
    You are a financial assistant.
    Here are the 7 latest news articles:
    
    {news_text}
    
    User asks: {user_msg}
    
    Please respond with a concise summary and key implications for markets.
    """

    resp = client.messages.create(
        model="claude-sonnet-4-20250514",  # Sonnet 4
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )

    answer = "\n".join(block.text for block in resp.content if block.type == "text")

    state["messages"].append(AIMessage(content=answer))
    return state

builder = StateGraph(ChatState)
builder.add_node("User Input", user_input)
builder.add_node("RAG", rag_call)

builder.add_edge(START, "User Input")
builder.add_edge("User Input", "RAG")
builder.add_edge("RAG", END)

graph = builder.compile()


if __name__ == "__main__":
    async def main():
        out = await graph.ainvoke({
            "messages": [HumanMessage(content="What do the latest news mean for tech stocks?")]
        })
        print(out["messages"][-1].content)

    asyncio.run(main())
