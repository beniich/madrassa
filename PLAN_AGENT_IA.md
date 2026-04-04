# Plan Agent IA — Madrassa App

## 5 sprints — 10 jours

## Architecture cible

```
Frontend (AIAssistant.tsx)
        |
        | SSE / REST
        v
Backend Express
  - AI Gateway (auth, rate-limit, logs)
  - Guardrails Engine (filtrage input/output)
  - Agent Router (selection modele + agent)
  - Agents: school_advisor | analytics | scheduling | document | chat
        |
        v
Docker Stack
  - Ollama (llama3.2:3b, mistral:7b, phi3:mini)
  - LiteLLM Proxy (abstraction multi-modele)
  - Open WebUI (admin UI)
```

## Sprint 1 - Docker AI Stack (2j)

Fichiers a creer:
- docker-compose.ai.yml
- litellm_config.yaml
- Ajouts .env

Services:
| Service     | Image                          | Port  |
|-------------|-------------------------------|-------|
| ollama      | ollama/ollama                  | 11434 |
| litellm     | ghcr.io/berriai/litellm        | 4001  |
| open-webui  | ghcr.io/open-webui/open-webui  | 3001  |

Modeles a pull:
- llama3.2:3b  - chat general
- mistral:7b   - conseil scolaire
- phi3:mini    - generation documents
- nomic-embed-text - embeddings RAG

## Sprint 2 - AI Gateway + Guardrails (2j)

Nouveaux fichiers:
backend/src/core/ai/
  aiGateway.ts
  guardrails.ts
  agentRouter.ts
  agents/SchoolAdvisorAgent.ts
  agents/AnalyticsAgent.ts
  agents/SchedulingAgent.ts
  agents/DocumentAgent.ts
  agents/ChatAgent.ts
  modelProviders/ollamaProvider.ts
  modelProviders/litellmProvider.ts
  modelProviders/openaiProvider.ts

Regles Guardrails:
  - maxInputLength: 2000 chars
  - blockedTopics: politique, violence, adulte, hacking
  - injectionDetection: true
  - maxOutputTokens: 1500
  - piiRedaction: true (noms anonymises)
  - agentScopes: chaque agent n'accede qu'a ses donnees

## Sprint 3 - Agents Specialises (2j)

| Agent          | Modele      | Fallback   | Timeout |
|----------------|-------------|------------|---------|
| school_advisor | mistral:7b  | gpt-4o-mini| 30s     |
| analytics      | llama3.2:3b | groq/llama | 20s     |
| scheduling     | phi3:mini   | llama3.2   | 15s     |
| document       | mistral:7b  | gpt-3.5    | 45s     |
| chat           | llama3.2:3b | phi3:mini  | 10s     |

Chaque agent = system prompt strict:
  - Langue francaise uniquement
  - Sujet scolaire uniquement
  - Source des donnees toujours citee
  - PII anonymises
  - Max 3 recommandations concretes

## Sprint 4 - UI Enrichie (1j)

Nouvelles features dans AIAssistant.tsx:
  - Selecteur de modele (dropdown)
  - Badge Guardrail (message filtre ?)
  - Toggle Mode Strict / Mode Libre
  - Feedback 👍👎 par message
  - Contexte auto-injecte (eleve selectionne)
  - Historique sessions (localStorage)

## Sprint 5 - RAG (3j)

Retrieval-Augmented Generation:
  Documents ecole -> Chunking -> Embeddings (nomic) -> pgvector
  Question -> Embedding -> Similarite -> Contexte -> LLM -> Reponse

Stack:
  - nomic-embed-text (Ollama)
  - pgvector extension PostgreSQL
  - Drizzle schema pour vecteurs
  - Ingestion auto: bulletins, lettres, PV

## Variables .env a ajouter

AI_GATEWAY_URL=http://localhost:4001
LITELLM_MASTER_KEY=sk_litellm_madrassa_2026
OLLAMA_BASE_URL=http://localhost:11434
AI_RATE_LIMIT_PER_MIN=20
AI_MAX_TOKENS=1500
AI_GUARDRAILS_ENABLED=true
AI_DEFAULT_MODEL=llama3.2:3b

## Prerequis

- Docker Desktop installe
- Min 8 Go RAM libre
- GPU NVIDIA optionnel (x10 plus rapide)
