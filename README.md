# Mirai Analytics 

Mirai Analytics is an AI-powered financial assistant and analytics platform designed for private. It combines real-time market data, news analysis, portfolio insights, and conversational AI to help users make smarter investment decisions.

##  Features

- **AI Investment Voice Assistant**  
  Chat with an AI that understands market trends, portfolio impacts, and can answer investment questions in natural language.

- **Portfolio Analytics**  
  Visualize your holdings, sector allocations, and receive actionable rebalancing suggestions. Get friendly, practical recommendations based on your risk profile.

- **Market Overview**  
  See real-time market data, trends, and sector performance in a clean dashboard.

- **News & Insights**  
  Aggregates and analyzes financial news from top sources (Reuters, Bloomberg, FT, Yahoo Finance, CNBC).  
  Highlights important articles, scores impact, and provides concise summaries and actionable insights.

- **Onboarding Flow**  
  Personalized onboarding to capture user risk tolerance, sector interests, and notification preferences.

- **AI-Generated Tips & Insights**  
  Get premium AI insights and tips tailored to your portfolio and interests.

- **Realtime & Scheduled Data Ingestion**  
  Automated backend pipelines scrape, normalize, and analyze news and market data.

##  Tech Stack

**Frontend:**  
- React Native (Expo)  
- TypeScript  
- NativeWind (Tailwind CSS for React Native)  
- Lucide Icons  
- React Navigation  
- TanStack React Query  

**Backend:**  
- Python 3.12  
- Quart (async Flask-like web framework)  
- SQLAlchemy (async ORM)  
- PostgreSQL  
- LangChain & LangGraph (AI workflow orchestration)  
- Anthropic API (LLMs for extraction, scoring, and writing)
- OpenAI API 
- Twilio (voice assistant integration)  
- ElevenLabs (voice synthesis)  
- Async web scraping (Crawl4AI, Playwright)

**Other:**  
- Pydantic (schemas & validation)  
- Docker/Conda (environment management)  
- Task scheduling (quart-tasks)  
- Safe area/context for mobile UI

##  Architecture

- **Frontend:**  
  Mobile-first, modular React Native app with screens for Home, News, Portfolio, and Assistant.  
  Uses hooks and context for state management and onboarding persistence.

- **Backend:**  
  Async API endpoints for news, insights, portfolio analysis, and recommendations.  
  Modular pipelines for scraping, normalization, fact extraction, impact scoring, and verification.  
  LLM-powered summarization and conversational responses.

- **Data Flow:**  
  1. Scrape news → Normalize → Extract facts → Score impact → Write analyst brief → Verify output  
  2. Portfolio data → Analyze allocation, risk, and trends → Generate recommendations
