from sqlalchemy import Column, String, DateTime, Numeric, Boolean, ForeignKey, Integer, SmallInteger
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Integer
from backend.utils.helpers import utcnow
from backend.db.types import Vector1536
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from backend.utils.helpers import utcnow

Base = declarative_base()


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String, nullable=False, unique=True)
    source_domain = Column(String, nullable=False)
    raw = Column(String, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=False)
    fetched_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=utcnow,
    )
    lang = Column(String, nullable=True)
    hash_64 = Column(Numeric, nullable=True)
    content_emb = Column(Vector1536)
    provider = Column(String, nullable=True)
    image_url = Column(String, nullable=True)


class ArticleAnalysis(Base):
    __tablename__ = "article_analysis"

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_url = Column(String, ForeignKey("articles.url", ondelete="CASCADE"), unique=True, nullable=False)

    cluster_ids = Column(ARRAY(String), nullable=True)
    event_type = Column(String, nullable=False)
    tickers = Column(ARRAY(String), nullable=True)
    companies = Column(ARRAY(String), nullable=True)
    sectors = Column(ARRAY(String), nullable=True)
    geos = Column(ARRAY(String), nullable=True)
    numerics = Column(JSONB, nullable=True)

    impact_score = Column(Integer, nullable=False)
    confidence = Column(Integer, nullable=False)
    novelty = Column(Integer, nullable=False)

    executive_summary = Column(String, nullable=False)
    bullets = Column(JSONB, nullable=False)
    actions = Column(JSONB, nullable=True)
    risks = Column(JSONB, nullable=True)
    citations = Column(JSONB, nullable=False)

    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    important = Column(Boolean, nullable=False, default=False)
    markets = Column(ARRAY(String), nullable=True)

    __table_args__ = (
        UniqueConstraint("article_url", name="uq_article_analysis_article_url"),
        Index("ix_article_analysis_id", "id"),
    )



class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(String, nullable=False)
    link = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password_enc = Column(String, nullable=False)  # encrypted password


class Assets(Base):
    __tablename__ = "assets"

    id = Column(SmallInteger, primary_key=True, autoincrement=True)
    ticker = Column(String, nullable=False)
    label = Column(String, nullable=False)

class EntitySentiment(Base):
    __tablename__ = "entity_sentiments"

    id = Column(Integer, primary_key=True, autoincrement=True)

    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    asset_id = Column(SmallInteger, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)

    label = Column(String, nullable=False)
    score = Column(Float, nullable=False)



class Source(Base):
    __tablename__ = "sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=True)
    description = Column(String, nullable=True)
    status = Column(String, default="active")
    last_update = Column(DateTime(timezone=True), nullable=True)
    articles_per_day = Column(Numeric, nullable=True)
    reliability = Column(Numeric, nullable=True)
    keywords = Column(String, nullable=True)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


