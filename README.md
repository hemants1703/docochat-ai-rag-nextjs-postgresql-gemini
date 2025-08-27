## Docochat AI — Talk to your documents

Docochat AI lets you upload documents (PDF, TXT, MD, RTF), train them into a vector store, and chat with them through a sleek, modern interface. It’s built for robust performance, clean architecture, and an excellent user experience.

- **Framework**: Next.js 15 (App Router), React 19
- **UI**: Tailwind CSS 4, shadcn/ui, Radix primitives
- **Vector store & DB**: Supabase (Postgres + pgvector)
- **Embeddings & Chat**: Google Gemini (`gemini-embedding-001`, `gemini-2.0-flash-lite`)

Visit `http://localhost:3000` after setup.

---

### Why this project stands out

- **User-centric UX**: Thoughtful micro‑interactions, gradients, and motion on the landing and train flows.
- **Solid data flow**: Deterministic pipeline from file validation → text extraction → chunking → embedding → vector upsert.
- **Production-minded**: Input validation, error paths, typed APIs, and Supabase stored function retrieval.
- **Clear separation of concerns**: UI components, API routes, and lib services are neatly organized.

---

### Demo walkthrough

1) Go to Train → upload a supported file. Backend confirms support and size.
2) The app extracts text, splits into chunks, generates embeddings (1536 dims), and upserts vectors to Supabase.
3) Start a chat. Your query is embedded and matched against the vector store via a Supabase RPC. Gemini responds with context‑aware answers.

---

## Architecture

```
Next.js (App Router)
  ├─ UI (Tailwind, shadcn/ui)
  ├─ API Routes
  │   ├─ POST /api/document/confirm-support  (file-type validation)
  │   ├─ POST /api/document/train            (extract → chunk → embed → upsert)
  │   └─ POST /api/user/create-user          (bootstrap user row)
  └─ Server Actions (Chat)
      └─ sendMessage → embed query → Supabase RPC (match_trained_documents) → Gemini

Supabase (Postgres + pgvector)
  ├─ Tables: users, vector_store, chats_store
  └─ RPC: match_trained_documents (semantic retrieval)

Google Gemini
  ├─ Embeddings: gemini-embedding-001 (1536 dims)
  └─ Chat: gemini-2.0-flash-lite
```

Key modules:
- `src/lib/api-services/train/text-extraction-services.ts` — Extracts text from PDF/RTF/TXT/MD.
- `src/lib/api-services/train/text-chunking-services.ts` — Splits text (LangChain) into overlapping chunks.
- `src/lib/api-services/train/text-embedding-services.ts` — Generates embeddings via Gemini.
- `src/lib/api-services/train/text-upsert-to-db.ts` — Upserts one row per chunk with vectors to Supabase.
- `src/lib/actions/chat/chat-actions.ts` — Embeds query, retrieves nearest chunks via RPC, calls Gemini for response, persists message pairs.

---

## Features

- **Document training**: PDF, TXT, MD, RTF (DOCX & CSV are under development)
- **Semantic retrieval**: pgvector with custom match RPC
- **Chat with context**: Gemini responses grounded in retrieved chunks
- **Modern UI**: Accessible components (Radix), responsive design, dark mode
- **Credits/quota model**: User rows track credits and file allowances

---

## Getting started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase project with pgvector enabled
- Google Gemini API key

### Environment variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Install & run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

---

## Database setup (Supabase)

Schema files are in `supabase/migrations/`. Apply them in order using the Supabase SQL editor (or your preferred migration flow):

- `20250712080659_create_vector_store_table.sql`
- `20250712081303_create_user_table.sql`
- `20250714113121_create_chats_store.sql`

Make sure pgvector is enabled and the `match_trained_documents` RPC is available to perform semantic search against `vector_store`.

---

## API reference

All endpoints are under the Next.js App Router.

### POST `/api/document/confirm-support`
Validates the uploaded file’s true type and size.

Request (multipart/form-data):
```
file: File
```

Response 200:
```json
{ "success": true, "message": "File is supported" }
```

Response 500:
```json
{ "success": false, "message": "Unsupported file type..." }
```

### POST `/api/document/train`
Extracts text → chunks → embeds → upserts vectors. Enforces user quotas.

Request (multipart/form-data):
```
file: File
userDetails: stringified JSON of { id, username, credits_available, credits_used, files_available, files_used, created_at, updated_at }
```

Response 200:
```json
{ "message": "File trained successfully" }
```

Response 4xx/5xx: JSON error message.

### POST `/api/user/create-user`
Bootstraps a user row in `users`.

Request (JSON):
```json
{ "id": "uuid", "username": "...", "credits_available": 100, "credits_used": 0, "files_available": 1, "files_used": 0, "created_at": "ISO", "updated_at": "ISO" }
```

Response 201:
```json
{ "message": "User created successfully" }
```

---

## Chat flow (server action)

`sendMessage(previousState, formData)` in `src/lib/actions/chat/chat-actions.ts`:
1. Validate input (Zod schema).
2. Embed the user query with Gemini.
3. Call `match_trained_documents` RPC with the query vector to fetch top matches.
4. Build a system prompt with the top file content.
5. Call `gemini-2.0-flash-lite` with prior chat context to generate the assistant response.
6. Persist user + assistant messages into `chats_store`.

---

## Local development tips

- Keep an eye on quotas in the `users` table; training enforces limits.
- The text extraction pipeline supports TXT/MD/RTF/PDF out of the box. Extend DOCX/CSV as needed.
- For embeddings, the output dimensionality is set to 1536 to balance storage and performance.

---

## Project structure

```
src/
  app/
    api/
      document/confirm-support
      document/train
      user/create-user
    chat/
    train/
  components/
    features/ (chat, train, home)
    ui/ (shadcn)
  lib/
    actions/ (chat server actions)
    api-services/train/ (extraction, chunking, embeddings, upsert)
    supportedFileTypes.ts
supabase/ (client, server, migrations)
```

---

## Performance & reliability notes

- Vector writes are batched per chunk; errors are surfaced early and stop the pipeline.
- Retrieval is done server-side via Supabase RPC to keep latency low.
- Previous chat turns are persisted and replayed to Gemini for continuity.

---

## Security considerations

- Supabase keys are loaded from environment; do not commit `.env.local`.
- File-type checking uses both declared MIME and content-based detection.
- Server actions and API routes validate inputs and handle error states.

---

## Roadmap

- Multi-file training sessions
- Per-chunk source attributions in chat answers
- RAG prompt templates and citations
- File management (list/delete/retrain)
- Evaluation harness and basic unit tests

---

## License

MIT — see `LICENSE` if/when added.

