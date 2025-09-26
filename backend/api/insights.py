# api/news.py
from quart import Blueprint, jsonify, request
from sqlalchemy import text
from backend.db.session import SessionLocal
from pydantic import ValidationError
from backend.schemas import AnalyzeNewsRequest, ImportancePayload
from backend.services.generate_insight import generate_insights_for_article

@bp.get("/insights")
async def list_insights():
    try:
        async with SessionLocal() as session:
            q = text(
                """
                SELECT a.url AS id, a.url, a.source_domain, a.title, a.summary, a.raw AS content,
                       a.published_at, a.image_url,
                       COALESCE(aa.impact_score, 0) AS impact_score, aa.important AS importance_flag
                FROM articles a
                LEFT JOIN article_analysis aa ON a.url = aa.article_url
                WHERE aa.important = 1
                ORDER BY a.published_at DESC
                LIMIT 3;
                """
            )
            rows = (await session.execute(q)).mappings().all()
            if not rows:
                return jsonify({"error": "No important articles found"}), 404

            results = []
            for row in rows:
                published_at = row["published_at"].isoformat() if row["published_at"] else None
                impact_score = row.get("impact_score", 0) or 0
                db_flag = row.get("importance_flag")
                is_important = bool(db_flag) if db_flag is not None else (impact_score >= 60)
                importance_label = (
                    "high" if impact_score > 75 else
                    "medium" if impact_score > 50 else
                    "low"
                )

                article_json = {
                    "id": row["id"],
                    "url": row["url"],
                    "source": row["source_domain"],
                    "title": row["title"],
                    "summary": row["summary"],
                    "content": row["content"],
                    "publishedAt": published_at,
                    "photo": row.get("image_url"),
                    "isImportant": is_important,
                    "importance": importance_label,
                    "markets": [],
                    "clients": [],
                    "communitySentiment": int(min(impact_score * 1.2, 100)),
                    "trustIndex": int(min(impact_score * 1.3, 100)),
                }

                # 🔹 Call Claude service here
                article_with_insights = await generate_insights_for_article(article_json)
                article_with_insights["impact_score"] = importance_label
                results.append(article_with_insights)

            return jsonify(results)

    except Exception as e:
        return jsonify({"error": f"Failed to fetch news detail: {str(e)}"}), 500
