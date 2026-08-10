# 🤖 AI GitHub Codebase Analyzer

An AI-powered code intelligence platform that analyzes GitHub repositories and enables natural language interaction with large codebases using Retrieval-Augmented Generation (RAG).

This project combines semantic code search, embeddings, vector databases, backend pipelines, and an iOS client to create a production-style AI system capable of understanding software architecture, workflows, and implementation details across thousands of files.

---

# 🧰 Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![pgvector](https://img.shields.io/badge/pgvector-4169E1?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white&style=for-the-badge)
![GitHub_API](https://img.shields.io/badge/GitHub_API-181717?logo=github&logoColor=white&style=for-the-badge)
![REST_API](https://img.shields.io/badge/REST_API-FF6F00?style=for-the-badge)

---

## 🎥 Demonstration

<!-- Replace this placeholder with your recorded demo GIF -->

![AI GitHub Codebase Analyzer Demo](Readme-Photos/Demo.gif)

The demonstration shows the complete end-to-end workflow:

```text
Search GitHub Repository
        ↓
Select Repository
        ↓
Analyze Repository
        ↓
Repository Ingestion
        ↓
Code Processing + Chunking
        ↓
Embedding Generation
        ↓
Vector Storage
        ↓
Natural Language Query
        ↓
Semantic Retrieval
        ↓
Relevant Code Context
        ↓
LLM Response
        ↓
Code + File References
```

---

## 🛠️ Technical Implementation

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Markdown-rendered AI responses
- Interactive repository/file explorer

### Backend

- Python
- Flask
- REST APIs
- Modular service architecture
- GitHub REST API integration

### AI / RAG

- OpenAI APIs
- Text embeddings
- Vector similarity search
- Retrieval-Augmented Generation
- Semantic code retrieval
- Context injection
- LLM-based code explanation

### Data Layer

- PostgreSQL
- pgvector
- Redis
- Vector embeddings
- Repository/chunk metadata

---

## 🧩 System Design

The system is designed as an end-to-end AI pipeline that transforms an external GitHub repository into a searchable knowledge base.

### Architecture

<!-- Replace this placeholder with your system design diagram -->

![System Design](Readme-Photos/System-Design.png)

### High-Level Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         │                      │
                         │ Search / Analyze /   │
                         │ Ask Questions        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Next.js         │
                         │      Frontend        │
                         │                      │
                         │ Search / Repository  │
                         │ Explorer / Chat      │
                         └──────────┬───────────┘
                                    │
                               REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Flask API      │
                         │                      │
                         │ Routes / Controllers │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │ GitHub Service │ │ Chunk Service  │ │  Chat Service  │
        │                │ │                │ │                │
        │ Repo Metadata  │ │ Code Parsing   │ │ Query Handling │
        │ Tree Retrieval │ │ Chunking       │ │ Context Build  │
        │ Blob Retrieval │ │ Metadata       │ │ LLM Request    │
        └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
                │                  │                  │
                └──────────────────┼──────────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │   Embedding Service  │
                         │                      │
                         │ Code → Vectors       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ PostgreSQL +         │
                         │ pgvector             │
                         │                      │
                         │ Code Chunks          │
                         │ Metadata             │
                         │ Embeddings           │
                         └──────────┬───────────┘
                                    │
                              Similarity Search
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    OpenAI LLM        │
                         │                      │
                         │ Retrieved Context +  │
                         │ User Question        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Contextual Response  │
                         │ + File References    │
                         └──────────────────────┘
```

### Architecture Overview

- The **Next.js frontend** provides repository search, repository exploration, analysis status, and the AI chat interface.
- The **Flask backend** exposes REST endpoints and orchestrates the repository ingestion and RAG pipelines.
- The **GitHub service** retrieves repository metadata, repository trees, and file contents.
- The **processing layer** filters files and converts source code into structured chunks.
- The **embedding service** transforms code chunks and user queries into vector representations.
- **PostgreSQL + pgvector** stores code chunks, metadata, and embeddings while providing vector similarity search.
- The **chat service** retrieves relevant code and constructs the context supplied to the LLM.
- The **LLM** generates an explanation grounded in the retrieved repository code.

This separates repository ingestion, processing, retrieval, and generation into distinct stages rather than treating the application as a simple LLM wrapper.

---

## 🔄 Repository Ingestion Pipeline

The most important part of the system is the repository ingestion pipeline.

A GitHub repository cannot simply be sent directly to an LLM. Large repositories can contain thousands of files and tens of thousands of lines of code, making full-repository prompting inefficient and eventually exceeding model context limits.

Instead, the system converts the repository into a structured, searchable representation.

```text
GitHub Repository
        ↓
Repository Metadata
        ↓
Recursive Repository Tree
        ↓
Relevant File Filtering
        ↓
Blob Retrieval
        ↓
Base64 Decoding
        ↓
Source Code Extraction
        ↓
Tree Normalization
        ↓
Structural Chunking
        ↓
Embedding Generation
        ↓
PostgreSQL + pgvector
```

The completed ingestion flow is:

```text
GitHub Repo
    ↓
Tree
    ↓
Filtered Files
    ↓
Blob Fetch
    ↓
Decoded Source Code
    ↓
Structured Repository
    ↓
Code Chunks
    ↓
Embeddings
    ↓
Vector Database
```

This pipeline forms the foundation for semantic search and RAG-based code understanding.

---

## 🐙 GitHub Repository Ingestion

The GitHub service is responsible for communicating with the GitHub API and separating external API concerns from the rest of the application.

### Responsibilities

```text
GitHub Service
│
├── Repository metadata
├── Default branch
├── Repository tree
├── File paths
├── Blob retrieval
├── Base64 decoding
└── Relevant file filtering
```

The repository is first retrieved as a recursive tree.

GitHub provides file paths in a flat representation:

```json
[
  {
    "path": "src/app.py"
  },
  {
    "path": "src/utils/helpers.py"
  },
  {
    "path": "tests/test_app.py"
  }
]
```

The system then normalizes this representation into a nested structure:

```json
{
  "name": "my-repo",
  "owner": "julian",
  "branch": "main",
  "tree": {
    "src": {
      "app.py": {
        "content": "..."
      },
      "utils": {
        "helpers.py": {
          "content": "..."
        }
      }
    },
    "tests": {
      "test_app.py": {
        "content": "..."
      }
    }
  }
}
```

This normalized tree serves two purposes:

1. **Frontend navigation** — allowing users to browse the repository.
2. **RAG metadata hierarchy** — allowing chunks to retain repository and file-path context.

---

## 🧹 Relevant File Filtering

Not every repository file is useful for AI analysis.

A repository can contain:

- Binary assets
- Generated files
- Build artifacts
- Dependencies
- Lock files
- Images
- Large irrelevant files
- Other non-source content

Processing everything would waste:

- API requests
- CPU
- Embedding operations
- Database storage
- LLM context

The ingestion pipeline therefore filters repository contents before processing them.

```text
Repository Tree
      ↓
File Filtering
      ↓
Relevant Source Files
      ↓
Blob Retrieval
      ↓
Source Extraction
```

This allows the system to focus its computational resources on code and documentation that can contribute meaningful context to retrieval.

---

## 🧠 Structural Code Chunking

One of the most important design decisions in the RAG pipeline is **how code is chunked**.

A naive implementation could split every file every N characters.

That works reasonably well for generic text, but source code has structure.

For example:

```python
def authenticate_user(username, password):
    ...
```

should ideally remain a coherent semantic unit instead of being arbitrarily split in half.

### Semantic Dilution

Large chunks create another problem.

Imagine a file containing 800+ lines of unrelated functionality.

A query such as:

> "Where is user authentication handled?"

could retrieve the entire file even though only a small section contains authentication logic.

The embedding then represents many unrelated concepts simultaneously.

This creates **semantic dilution**.

The goal is therefore:

```text
File
 ↓
Meaningful Code Units
 ↓
Embeddings
 ↓
Precise Retrieval
```

Rather than:

```text
File
 ↓
Arbitrary 500-character chunks
 ↓
Noisy embeddings
 ↓
Poor retrieval
```

The system therefore uses **structural chunking**, where chunks represent meaningful units of source code.

Each chunk contains both content and metadata:

```json
{
  "id": "...",
  "path": "src/auth/login.py",
  "chunk_type": "function",
  "content": "def login(): ...",
  "metadata": {
    "repository": "my-repo",
    "folder": "src/auth"
  }
}
```

This preserves the relationship between the code and the repository structure.

---

## 🔢 Embeddings

Once code has been converted into retrievable chunks, each chunk is transformed into a vector representation.

Conceptually:

```text
Source Code
     ↓
Embedding Model
     ↓
[0.021, -0.184, 0.732, ...]
```

The vector represents semantic information about the code.

This allows the system to compare the meaning of a user's question against the meaning of code chunks.

For example:

```text
User Query:

"Where is authentication handled?"
              ↓
        Query Embedding
              ↓
       Vector Similarity
              ↓
 ┌────────────┼────────────┐
 ↓            ↓            ↓
auth.py    login.py    middleware.py
```

The system can therefore retrieve code based on semantic similarity rather than requiring an exact keyword match.

---

## 🗄️ PostgreSQL + pgvector

Embeddings are stored alongside the original source-code chunks and their metadata using PostgreSQL with pgvector.

The core representation is:

```sql
CREATE EXTENSION vector;

CREATE TABLE repo_chunks (
    id SERIAL PRIMARY KEY,
    repo_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536)
);
```

Each record contains:

```text
Repository
    +
File Path
    +
Source Code
    +
Embedding
```

This allows the database to function as both:

- Persistent storage for code chunks
- Vector search engine for semantic retrieval

The vector service embeds each chunk and inserts the resulting representation into PostgreSQL.

---

## 🔎 Semantic Retrieval

When a user asks a question, the query follows the same embedding process used for repository chunks.

```text
User Question
      ↓
Query Embedding
      ↓
Vector Similarity Search
      ↓
Top-K Relevant Chunks
```

The system searches within the selected repository and retrieves the most semantically relevant code.

Conceptually:

```python
search_chunks(
    repo_name,
    query_embedding,
    limit=5
)
```

The pgvector similarity operator is used to compare the query vector against stored embeddings.

The important constraint is that retrieval is scoped to the selected repository rather than searching across unrelated codebases.

---

## 🧠 Retrieval-Augmented Generation

The RAG pipeline combines retrieval with LLM generation.

Instead of asking the LLM:

> "How does this repository handle authentication?"

with no repository context, the system first retrieves relevant code.

```text
                   User Question
                         │
                         ▼
                  Query Embedding
                         │
                         ▼
                 Vector Retrieval
                         │
                         ▼
              Top Relevant Code Chunks
                         │
                         ▼
                 Context Construction
                         │
                         ▼
                  LLM + User Query
                         │
                         ▼
                 Generated Explanation
```

The LLM therefore receives:

```text
Repository Context
        +
Relevant File Paths
        +
Retrieved Source Code
        +
User Question
```

This grounds the response in the actual repository instead of relying exclusively on the model's pretrained knowledge.

---

## 💬 Chat Pipeline

The `/repo/chat` endpoint represents the complete RAG request lifecycle.

Example request:

```json
{
  "repo": "LadLadder",
  "question": "How are players scored?"
}
```

The backend performs:

```text
1. Receive repository + question
            ↓
2. Embed question
            ↓
3. Search repository vectors
            ↓
4. Retrieve relevant chunks
            ↓
5. Extract source code + paths
            ↓
6. Construct LLM context
            ↓
7. Send context + question to LLM
            ↓
8. Generate response
            ↓
9. Return explanation + relevant files
```

The response can include both the generated explanation and file-level references, allowing the user to connect the AI's answer back to the actual source code.

---

## 🖥️ Frontend Architecture

The frontend is implemented with Next.js and provides the user-facing interface for the entire analysis pipeline.

### User Workflow

```text
Home
 ↓
Search Repositories
 ↓
Repository Page
 ↓
Analyze Repository
 ↓
Analysis Progress
 ↓
Chat Interface
 ↓
File Explorer + AI Responses
```

The application provides:

- GitHub repository search
- Repository metadata
- Repository tree navigation
- File browsing
- Analysis status
- Natural-language chat
- Markdown-rendered AI responses
- Relevant file references

The frontend acts as the presentation layer while the Flask backend owns repository ingestion, processing, retrieval, and AI orchestration.

---

## 🔁 End-to-End Request Flow

### Repository Analysis

```text
User
 ↓
Next.js
 ↓
Flask API
 ↓
GitHub Service
 ↓
Repository Tree
 ↓
File Filtering
 ↓
Blob Retrieval
 ↓
Source Extraction
 ↓
Code Chunking
 ↓
Embedding Service
 ↓
PostgreSQL + pgvector
```

### AI Question

```text
User
 ↓
Next.js Chat
 ↓
Flask API
 ↓
Embed Question
 ↓
pgvector Similarity Search
 ↓
Top-K Code Chunks
 ↓
Context Construction
 ↓
OpenAI LLM
 ↓
Generated Explanation
 ↓
Relevant File References
 ↓
Next.js UI
```

---

## 🚀 Features

- GitHub repository search
- Repository metadata retrieval
- Recursive repository tree traversal
- Source-code ingestion
- Relevant file filtering
- Base64 GitHub blob decoding
- Repository tree normalization
- Structural code chunking
- Semantic code embeddings
- PostgreSQL vector storage
- pgvector similarity search
- Repository-scoped retrieval
- Retrieval-Augmented Generation
- Natural-language codebase chat
- Context-aware AI explanations
- File-level references in responses
- Interactive repository file explorer
- Markdown-rendered AI responses
- Modular Flask service architecture
- Next.js frontend
- Redis caching
- Docker-based deployment

---

## 🏗️ Project Structure

```text
AI-GitHub-Codebase-Analyzer/
│
├── backend/
│   │
│   ├── api/
│   │   ├── repo_routes.py
│   │   └── ...
│   │
│   ├── services/
│   │   ├── github_service.py
│   │   ├── parser_service.py
│   │   ├── chunk_service.py
│   │   ├── embedding_service.py
│   │   ├── vector_service.py
│   │   ├── chat_service.py
│   │   ├── db_service.py
│   │   └── ...
│   │
│   ├── utils/
│   │   └── tree_builder.py
│   │
│   └── main.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── ...
│
├── Readme-Photos/
│   ├── System-Design.png
│   └── Demo.gif
│
├── Dockerfile
├── docker-compose.yml
├── README.md
└── ...
```

---

## ⚙️ API Architecture

The backend follows a modular service-oriented structure:

```text
Routes
  ↓
Services
  ↓
Processing Pipeline
  ↓
Storage
```

The GitHub integration is isolated inside `github_service.py`, while tree normalization, chunk extraction, embeddings, vector operations, and chat orchestration are separated into their own services.

This separation prevents API-specific logic from becoming tightly coupled to the AI pipeline.

---

## 📡 Example API Operations

### Search Repositories

```http
GET /search?q=node
```

Returns repository metadata including information such as:

```json
{
  "name": "...",
  "owner": "...",
  "language": "...",
  "stars": "...",
  "url": "..."
}
```

### Retrieve Repository Tree

```http
GET /repo/tree?owner=<owner>&repo=<repo>
```

Returns the normalized repository structure used by the frontend.

### Retrieve File

```http
GET /repo/file?owner=<owner>&repo=<repo>&path=README.md
```

Returns the decoded source contents of a repository file.

### Generate Chunks

```http
GET /repo/chunks?owner=<owner>&repo=<repo>
```

Produces the code chunks used for embedding and retrieval.

### Ask Repository

```http
POST /repo/chat
```

Example:

```json
{
  "repo": "LadLadder",
  "question": "How are players scored?"
}
```

---

## 🧪 Example RAG Interaction

### User

```text
How are players scored?
```

### Retrieval Layer

```text
Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Top 5 Relevant Chunks
```

Example retrieved context:

```text
src/game/scoring.py
src/game/player.py
src/game/match.py
```

### LLM

The retrieved source code and file paths are injected into the prompt.

### Response

The LLM generates a contextual explanation while referencing the relevant repository files.

This makes the application function as a **codebase reasoning interface** rather than a generic chatbot.

---

## 📊 Performance Considerations

The project was designed around several performance goals:

| Component | Target |
|---|---:|
| Semantic search latency | < 500 ms |
| Chat response time | < 2–3 s |
| Repository size | 1000+ files |
| Embedding storage | Batch-oriented |
| Repeated processing | Reduced through caching |

These goals influence several architectural decisions.

### Batch Processing

Embedding operations can become expensive when processing large repositories, so chunks should be processed in batches rather than through unnecessary individual requests.

### Filtering Before Embedding

Irrelevant files are removed before embedding generation.

```text
1000+ Repository Files
        ↓
     Filtering
        ↓
Relevant Source Files
        ↓
      Chunking
        ↓
    Embeddings
```

### Caching

Redis can be used to avoid repeatedly performing expensive repository processing and API operations.

```text
Request
  ↓
Redis Cache?
 ┌───────┴───────┐
 │               │
 HIT             MISS
 │               │
Return         Process
                 ↓
              Cache
                 ↓
              Return
```

---

## 🧠 Key Technical Concepts

### Retrieval-Augmented Generation

Combines information retrieval with LLM generation:

```text
Retrieve → Context → Generate
```

### Embeddings

Transforms code and natural-language queries into numerical vector representations.

### Vector Similarity

Allows the system to search for semantically related code rather than relying solely on exact keyword matching.

### Structural Chunking

Breaks source code into meaningful units instead of blindly splitting files by character count.

### Context Injection

Provides retrieved repository information to the LLM as contextual evidence.

### Repository-Scoped Retrieval

Ensures that queries retrieve information from the repository currently being analyzed.

### Service-Based Backend Architecture

Separates:

```text
GitHub
Parsing
Chunking
Embeddings
Vector Search
Chat
Database
```

into independently understandable components.

---

## 🛡️ Engineering Considerations

The system was designed with several real-world constraints in mind.

### Large Codebases

A repository cannot simply be placed entirely into an LLM context window.

The ingestion and retrieval pipeline therefore reduces the repository into smaller searchable units.

### API Efficiency

GitHub API calls are minimized by:

- Recursive tree retrieval
- Relevant-file filtering
- Structured repository snapshots
- Caching
- Batch processing

### Retrieval Quality

Retrieval quality depends heavily on chunk quality.

Poor chunking can produce:

```text
Large Chunk
 ↓
Multiple Unrelated Concepts
 ↓
Weak Embedding Representation
 ↓
Poor Retrieval
```

Better structural chunking produces:

```text
Function / Class / Logical Unit
 ↓
Focused Embedding
 ↓
More Relevant Retrieval
 ↓
Better LLM Context
```

---

## 🐳 Docker

The application is designed to be containerized so the major components can be run consistently across environments.

Expected architecture:

```text
┌──────────────────────┐
│      Next.js         │
│      Frontend        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Flask API       │
│      Backend         │
└───────┬──────┬───────┘
        │      │
        │      ▼
        │   ┌──────────────┐
        │   │    Redis     │
        │   └──────────────┘
        │
        ▼
┌──────────────────────┐
│ PostgreSQL + pgvector│
└──────────────────────┘
```

---

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/AI-GitHub-Codebase-Analyzer.git
cd AI-GitHub-Codebase-Analyzer
```

### 2. Configure environment variables

Create a `.env` file:

```env
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key

DATABASE_URL=your_postgresql_connection_string

REDIS_URL=redis://localhost:6379
```

### 3. Start the backend

```bash
python -m backend.main
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the application

```text
http://localhost:3000
```

---

## 🔬 What I Learned

This project went beyond simply integrating an LLM API.

### AI / ML

- How embeddings represent semantic information
- How vector similarity works
- How retrieval affects LLM quality
- How RAG pipelines provide external context
- How chunking influences retrieval quality
- How LLMs can be integrated into traditional backend systems

### Backend Engineering

- Flask REST API architecture
- Service-based application design
- External API integration
- Repository ingestion pipelines
- Asynchronous/background processing
- Data transformation pipelines

### Databases

- PostgreSQL schema design
- pgvector
- Vector similarity search
- Embedding storage
- Repository/chunk metadata relationships

### Systems Design

- Designing multi-stage data pipelines
- Separating ingestion from retrieval
- Caching expensive operations
- Handling large repositories
- Designing around API and model constraints
- Building systems around data flow rather than individual features

---

## 🔮 Future Improvements

- AST-based structural code parsing
- More advanced language-specific chunking
- Function/class dependency graphs
- Repository architecture visualization
- Multi-language code analysis
- Incremental repository indexing
- GitHub webhook-based re-indexing
- Improved retrieval ranking
- Hybrid keyword + vector search
- Reranking models
- Redis-backed background job queues
- Streaming LLM responses
- Conversation memory
- Authentication and user accounts
- Repository analysis history
- Kubernetes deployment
- Distributed tracing
- Evaluation framework for RAG retrieval quality
- Automated retrieval benchmarks

---

## 📚 What This Project Demonstrates

- End-to-end AI system architecture
- Retrieval-Augmented Generation
- Vector databases and semantic search
- Embedding pipelines
- Large-scale code ingestion
- Backend service architecture
- REST API design
- PostgreSQL + pgvector
- GitHub API integration
- LLM orchestration
- Frontend/backend integration
- Caching strategies
- Data pipeline design
- AI application performance considerations

---

## 🏁 Summary

The **AI GitHub Codebase Analyzer** transforms GitHub repositories into searchable AI knowledge bases.

The system starts with raw repository data:

```text
GitHub Repository
```

and progressively transforms it into:

```text
Repository
    ↓
Structured Tree
    ↓
Relevant Source Files
    ↓
Semantic Code Chunks
    ↓
Embeddings
    ↓
Vector Database
    ↓
Semantic Retrieval
    ↓
LLM Context
    ↓
Natural Language Explanation
```

The result is an AI-powered interface for understanding unfamiliar software systems without manually reading an entire codebase.

Rather than treating an LLM as a standalone chatbot, this project focuses on the **engineering required to give an LLM access to a large, structured, external knowledge source**.

**Built to explore AI systems — engineered around real software architecture.**
