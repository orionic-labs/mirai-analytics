from openai import AsyncOpenAI

client = AsyncOpenAI()

async def generate_insights_for_article(article_json: dict) -> dict:
    """
    Takes the article JSON (as built in news.py) and asks Claude to generate insights.
    Returns the same dict with an 'insights' field added.
    """

    prompt = (
        "You are a senior financial analyst.\n\n"
        "You will be given one news article (title, summary, and full text).\n"
        "Your task is to generate a structured JSON object with the following fields:\n\n"
        "1. title: Repeat the article title exactly.\n"
        "2. short_summary: A concise summary of the article in **12 words or fewer**.\n"
        "3. confidence_score: An integer from 0 to 100 indicating your confidence in the insight.\n"
        "4. impact_level: One of 'low', 'medium', or 'high' to describe potential financial market impact.\n\n"
        "Do not include any extra text, explanations, or formatting — only valid JSON.\n\n"
        f"Title: {article_json.get('title')}\n"
        f"Summary: {article_json.get('summary')}\n"
        f"Content: {article_json.get('content')}\n\n"
        "Output format:\n"
        "{\n"
        '  "title": "...",\n'
        '  "short_summary": "...",\n'
        '  "confidence_score": 85,\n'
        '  "impact_level": "medium"\n'
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
