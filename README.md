# 🤖 AI GitHub Codebase Analyzer

An AI-powered code intelligence platform that analyzes GitHub repositories and enables natural language interaction with large codebases using Retrieval-Augmented Generation (RAG).

This project combines semantic code search, embeddings, vector databases, backend pipelines, and an iOS client to create a production-style AI system capable of understanding software architecture, workflows, and implementation details across thousands of files.

---

# 🧰 Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=for-the-badge)
![Swift](https://img.shields.io/badge/Swift-F05138?logo=swift&logoColor=white&style=for-the-badge)
![SwiftUI](https://img.shields.io/badge/SwiftUI-0A84FF?logo=swift&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![pgvector](https://img.shields.io/badge/pgvector-4169E1?style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![GitHub API](https://img.shields.io/badge/GitHub_API-181717?logo=github&logoColor=white&style=for-the-badge)
![REST API](https://img.shields.io/badge/REST_API-FF6F00?style=for-the-badge)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=white&style=for-the-badge)

---

# 🧩 System Design

This system ingests GitHub repositories, processes source code into embeddings, stores semantic representations in a vector database, and enables AI-powered interaction through Retrieval-Augmented Generation.

---

## High-Level Flow

```text
User
  ↓
iOS App (SwiftUI)
  ↓
Flask API
  ↓
Repository Processing Pipeline
  ↓
Chunking + Embeddings
  ↓
PostgreSQL + pgvector
  ↓
Semantic Retrieval
  ↓
LLM Response Generation
  ↓
UI Response
```

---

# 🚀 Features

- GitHub repository search using GitHub API
- Repository ingestion & parsing pipeline
- Semantic code search using embeddings
- Retrieval-Augmented Generation (RAG)
- Natural language interaction with repositories
- AI-generated explanations of architecture & workflows
- Async background processing for large repositories
- PostgreSQL + pgvector vector similarity search
- Redis caching for optimized retrieval
- SwiftUI iOS application with real-time chat interface
- Modular backend service architecture
- Dockerized local development environment

---

# 🏗 Architecture

## Backend Services

### GitHub Service

- Searches repositories
- Retrieves repository metadata
- Downloads repository contents

---

### Processing Pipeline

```text
Fetch Repository
    ↓
Parse Files
    ↓
Chunk Code
    ↓
Generate Embeddings
    ↓
Store Vectors
```

---

### Embedding Service

- Converts code into vector embeddings
- Handles batching and processing optimization

---

### Vector Store

- PostgreSQL + pgvector
- Stores embeddings and metadata
- Performs cosine similarity search

---

### RAG Service

```text
User Query
    ↓
Query Embedding
    ↓
Semantic Retrieval
    ↓
Context Injection
    ↓
LLM Generation
    ↓
Final Response
```

---

# 📱 Frontend Architecture (MVVM)

```text
View
  ↓
ViewModel
  ↓
API Service
  ↓
Backend API
```

---

## Frontend Features

- Repository search UI
- AI chat interface
- File explorer
- Streaming responses
- Async networking using async/await

---

# 🗄️ Database Design

## Core Tables

```text
repositories
files
code_chunks
embeddings
chat_history
```

---

# ⚙️ Example API Endpoints

## Search Repositories

```http
GET /search?q=fastapi
```

---

## Analyze Repository

```http
POST /analyze
```

---

## Chat With Repository

```http
POST /chat
```

---

# 🏗 Folder Structure

```text
ai-codebase-analyzer/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── pipeline/
│   │   ├── rag/
│   │   ├── embeddings/
│   │   ├── github/
│   │   ├── models/
│   │   └── workers/
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── ios-app/
│   ├── Views/
│   ├── ViewModels/
│   ├── Services/
│   └── Models/
│
├── infrastructure/
│   ├── docker-compose.yml
│   └── postgres/
│
├── Readme-Photos/
│   └── System-Design.png
│
├── scripts/
│
├── README.md
└── LICENSE
```

---

# 🐳 Docker Setup

## docker-compose.yml

```yaml
services:
  api:
    build: .
    ports:
      - "5000:5000"

  postgres:
    image: pgvector/pgvector:pg16

  redis:
    image: redis:7-alpine
```

---

# 🛠 Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-codebase-analyzer.git
cd ai-codebase-analyzer
```

---

## 2. Create Environment Variables

```env
OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/codebase_ai
REDIS_URL=redis://localhost:6379
```

---

## 3. Start Services

```bash
docker-compose up --build
```

---

# 🧠 Key Concepts Implemented

- Retrieval-Augmented Generation (RAG)
- Embeddings & Vector Similarity Search
- Semantic Code Retrieval
- Backend Processing Pipelines
- Async Background Jobs
- Caching Strategies
- AI Context Injection
- Scalable REST API Design
- MVVM Architecture in SwiftUI

---

# ⚡ Performance Goals

- Semantic search latency under 500ms
- Chat response latency under 2–3 seconds
- Efficient handling of repositories with 1000+ files
- Batched embedding generation
- Redis caching for repeated queries

---

# 🔮 Future Improvements

- Multi-repository analysis
- Repository architecture visualization
- Streaming LLM responses
- Code dependency graph generation
- Kubernetes deployment
- OpenTelemetry tracing
- Fine-tuned code understanding models
- Collaborative team workspaces
- Incremental repository indexing
- Offline embedding workers

---

# 📚 What This Project Demonstrates

- Real-world AI system architecture
- Retrieval-Augmented Generation pipelines
- Embeddings & vector database engineering
- Backend scalability & async processing
- Production-style REST API design
- iOS frontend architecture with SwiftUI
- Distributed systems thinking
- End-to-end full-stack engineering

---

# 🏁 Summary

This project simulates a modern AI-powered developer tool capable of understanding and explaining large software systems using semantic retrieval and large language models.

Built to explore how real-world AI systems process, retrieve, and reason about code at scale.
