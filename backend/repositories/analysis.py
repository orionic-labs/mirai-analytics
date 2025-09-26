# repositories/analysis.py
from __future__ import annotations
import json
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.services.sms_service import send_sms_alert


async def insert_analysis_packet(
    session: Session, article_url: str, packet: Dict[str, Any], cluster_urls: list[str]
) -> None:
    await session.execute(
        text("""
            INSERT INTO article_analysis
              (article_url, cluster_ids, event_type, tickers, companies, sectors, geos, numerics,
               impact_score, confidence, novelty, executive_summary, bullets, actions, risks, citations, important, markets)
            VALUES
              (:url, :cluster_ids, :event_type, :tickers, :companies, :sectors, :geos, :numerics,
               :impact_score, :confidence, :novelty, :executive_summary, :bullets, :actions, :risks, :citations, :important, :markets)
        """),
        {
            "url": article_url,
            # массивы
            "cluster_ids": cluster_urls,
            "tickers": packet["extracted"]["tickers"],
            "companies": packet["extracted"]["companies"],
            "sectors": packet["extracted"]["sectors"],
            "geos": packet["extracted"]["geos"],
            "markets": packet["extracted"]["markets"],
            # JSONB
            "numerics": json.dumps(packet["extracted"]["numerics"]),
            "bullets": json.dumps(packet["packet"]["bullets"]),
            "actions": json.dumps(packet["packet"]["actions"]),
            "risks": json.dumps(packet["packet"]["risks"]),
            "citations": json.dumps(packet["packet"]["citations"]),
            # обычные типы
            "event_type": packet["extracted"]["event_type"],
            "impact_score": packet["impact"]["impact_score"],
            "confidence": packet["impact"]["confidence"],
            "novelty": packet["impact"]["novelty"],
            "executive_summary": packet["packet"]["executive_summary"],
            "important": packet["importance"]["importance"],
        },
    )
    # if packet["importance"]["importance"] == 1:
    #     await send_sms_alert(article_url, packet)
