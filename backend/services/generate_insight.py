from openai import AsyncOpenAI
from sqlalchemy import text
from backend.db.session import SessionLocal

client = AsyncOpenAI()



async def get_portfolio():
    """Return portfolio as a list of dicts (not JSON)."""
    async with SessionLocal() as session:
        query = text("SELECT asset_ticker, allocation_percent FROM allocation")
        rows = (await session.execute(query)).mappings().all()

    return [
        {
            "asset_ticker": str(row["asset_ticker"]),
            "allocation_percent": float(row["allocation_percent"]),
        }
        for row in rows
    ]


async def generate_insights_for_article(article_json: dict) -> dict:
    """
    Takes the article JSON (as built in news.py) and asks Claude to generate insights.
    Returns the same dict with an 'insights' field added.
    """
    portfolio_info = await get_portfolio()
    prompt = (
        "You are a senior financial analyst.\n\n"
        "You will be given one news article (title, summary, and full text) and a user's portfolio(asset allocation).\n"
        "Your task is to generate a structured JSON object with the following fields:\n\n"
        "1. title: Repeat the article title exactly.\n"
        "2. short_summary: A concise summary of the article in **12 words or fewer**.\n"
        "3. confidence_score: An integer from 0 to 100 indicating your confidence in the insight.\n"
        "Do not include any extra text, explanations, or formatting — only valid JSON.\n\n"
        f"User's portfolio: {portfolio_info}\n"
        f"Title: {article_json.get('title')}\n"
        f"Summary: {article_json.get('summary')}\n"
        f"Content: {article_json.get('content')}\n\n"
        "Output format:\n"
        "{\n"
        '  "title": "...",\n'
        '  "short_summary": "...",\n'
        '  "confidence_score": 85,\n'
        "}\n"
    )


    response = await client.chat.completions.create(
        model="claude-3-5-sonnet-latest",  # Claude via OpenAI API
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
    )

    insights_text = response.choices[0].message.content.strip()

    # Return the article with insights attached
    return {
        **article_json,
        "insights": insights_text,
    }
