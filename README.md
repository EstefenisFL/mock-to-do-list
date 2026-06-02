# Mock To-Do List

A minimal full-stack to-do list demo. The backend is **NestJS 11** (Node/TypeScript) storing items in a plain JSON-encoded text file. The frontend is **Angular 21** with **Angular Material**.

> No authentication, no database — this is a sample project.

---

## Project layout

```
mock-to-do-list/
├── backend/        # NestJS API (port 3000)
│   ├── src/
│   │   ├── todos/  # controller, service, DTOs, entity
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── todos.json  # runtime storage (auto-created, git-ignored)
├── frontend/       # Angular app (port 4200)
│   └── src/app/
│       ├── app.ts
│       ├── app.html
│       ├── app.scss
│       ├── todo.service.ts
│       └── todo.model.ts
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** 20+ (developed on 22)
- **npm** 10+

---

## Running the project

The backend and frontend run as two separate processes. Open **two terminals**.

### 1. Backend (NestJS — port 3000)

```bash
cd backend
npm install      # only the first time
npm run start    # or `npm run start:dev` for watch mode
```

On first boot the server creates `backend/todos.json` containing `[]`.

### 2. Frontend (Angular — port 4200)

```bash
cd frontend
npm install      # only the first time
npm start        # equivalent to `ng serve`
```

Open <http://localhost:4200> in your browser. The Angular app calls the backend at `http://localhost:3000`. CORS is pre-configured to accept both `localhost:4200` and `127.0.0.1:4200`.

---

## API — one route per operation

All routes live under `/todos`. Each business operation has its own dedicated path.

| # | Operation        | Method | Path                  | Body                                | Returns                |
|---|------------------|--------|-----------------------|-------------------------------------|------------------------|
| 1 | List items       | GET    | `/todos/list`         | —                                   | `Todo[]`               |
| 2 | Create item      | POST   | `/todos/create`       | `{ "text": "...", "dueDate"?: "YYYY-MM-DD" }` | `Todo`        |
| 3 | Delete item      | DELETE | `/todos/delete/:id`   | —                                   | `204 No Content`       |
| 4 | Edit item        | PUT    | `/todos/edit/:id`     | `{ "text"?: "...", "dueDate"?: "YYYY-MM-DD" }` | `Todo`       |
| 5 | Mark item done   | PATCH  | `/todos/done/:id`     | `{ "done": true }` (or `false`)     | `Todo`                 |

> `dueDate` is **optional**. When omitted on create, the todo is stored with `"dueDate": null`.

### `Todo` shape

```jsonc
{
  "id": "uuid-v4",
  "text": "Buy oat milk",
  "dueDate": "2026-06-05",
  "done": false,
  "createdAt": "2026-05-28T10:00:00.000Z"
}
```

### Quick curl smoke test

```bash
# create
curl -s -X POST http://localhost:3000/todos/create \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy milk","dueDate":"2026-06-05"}'

# list
curl -s http://localhost:3000/todos/list

# mark done (replace <id>)
curl -s -X PATCH http://localhost:3000/todos/done/<id> \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# edit
curl -s -X PUT http://localhost:3000/todos/edit/<id> \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy oat milk"}'

# delete
curl -s -X DELETE http://localhost:3000/todos/delete/<id>
```

---

## Storage

All data is persisted to **`backend/todos.json`** as a JSON array. The file is:

- created automatically on first boot if missing
- rewritten on every mutation (writes are serialized to avoid races)
- excluded from version control via `.gitignore`

To reset state, stop the backend and delete the file (or replace its contents with `[]`).

---

## Useful scripts

### Backend
```bash
npm run start       # start once (compiled)
npm run start:dev   # start with file watch
npm run build       # compile TS → dist/
```

### Frontend
```bash
npm start           # ng serve at http://localhost:4200
npm run build       # production build to dist/frontend
```

---

## Notes & limitations

- **No auth / no validation beyond shape.** Anyone hitting the API can read/write all todos.
- **Single-file storage.** Fine for a demo, but not safe for concurrent multi-process writes.
- **No tests** are shipped with this sample (the default scaffolds were removed for brevity).
