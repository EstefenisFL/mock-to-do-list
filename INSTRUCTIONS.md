# QA Engineer Test Assignment — Mock To-Do List

Welcome, and thanks for taking the time to work on this assignment. 👋

This is a take-home exercise. You're given a small, working full-stack **To-Do List** application. Your job is **not** to fix or change the app — it is to **test it** and show us how you think about quality, structure, and automation.

> We care more about **how** you approach testing (planning, organization, clarity, reasoning) than about the raw number of tests. A small, well-structured, well-explained suite beats a large messy one.

---

## 1. The application under test

A minimal full-stack to-do list:

- **Backend** — NestJS API on `http://localhost:3000`. Data is persisted to a JSON file: **`backend/todos.json`** (a JSON array). This file acts as the project's "database".
- **Frontend** — Angular + Angular Material on `http://localhost:4200`.

### Features you can see in the UI
- Add a task (text + **optional** due date).
- List tasks, with a counter `(N/10)`.
- A **maximum of 10 tasks** — the "Add" button is disabled at the limit and a hint message appears.
- Edit a task (text and/or due date) inline.
- Mark a task as done / not done (checkbox).
- Delete a task.
- Sort tasks by **text** or **due date**, ascending or descending.
- Empty state, loading spinner.

### API — one route per operation
All routes are under `/todos`:

| # | Operation      | Method | Path                | Body                                              | Returns          |
|---|----------------|--------|---------------------|---------------------------------------------------|------------------|
| 1 | List items     | GET    | `/todos/list`       | —                                                 | `Todo[]`         |
| 2 | Create item    | POST   | `/todos/create`     | `{ "text": "...", "dueDate"?: "YYYY-MM-DD" }`      | `Todo`           |
| 3 | Delete item    | DELETE | `/todos/delete/:id` | —                                                 | `204 No Content` |
| 4 | Edit item      | PUT    | `/todos/edit/:id`   | `{ "text"?: "...", "dueDate"?: "YYYY-MM-DD" }`     | `Todo`           |
| 5 | Mark done      | PATCH  | `/todos/done/:id`   | `{ "done": true }` (or `false`)                   | `Todo`           |

> `dueDate` is **optional**. When omitted on create, the todo is stored with `"dueDate": null`.

### `Todo` shape
```jsonc
{
  "id": "uuid-v4",
  "text": "Buy oat milk",
  "dueDate": "2026-06-05", // or null when no due date is set
  "done": false,
  "createdAt": "2026-05-28T10:00:00.000Z"
}
```

> ℹ️ Read the project `README.md` for full setup details. There is **no authentication** and **no real database** — storage is the single JSON file `backend/todos.json`.

---

## 2. Getting the app running

You need **Node.js 20+** and **npm 10+**. Open **two terminals**.

**Backend (port 3000):**
```bash
cd backend
npm install      # first time only
npm run start
```
On first boot the server creates `backend/todos.json` containing `[]`.

**Frontend (port 4200):**
```bash
cd frontend
npm install      # first time only
npm start
```
Open <http://localhost:4200>.

✅ **Sanity check:** add a task in the UI and confirm it appears in `backend/todos.json`.

---

## 3. What you must deliver

Please deliver **all** of the following. Each item below is a required topic — treat it like a checklist.

### 3.1 Test plan — as a worksheet 📋
Deliver your test plan as a **worksheet / spreadsheet** (Google Sheets, Excel `.xlsx`, or a `.csv` committed to the repo — your choice). A worksheet keeps the cases structured and easy to scan; please **don't** submit this part as free-form prose.

- Use **one row per test case**. Designing the columns is part of the exercise — choose the structure you'd actually use on the job. A good worksheet should let a reader quickly understand, for each case, **what is tested, how, what's expected, its priority, and its current result**, and should cover both **happy paths** and **negative / edge cases**.
- Make sure the surrounding context is captured somewhere (extra tabs, a header section, or a short companion note) — e.g. scope, test strategy, risk-based prioritization, environment/assumptions, and entry/exit criteria. How you organize this is up to you.
- Commit the file (or a link to it) in your test project so it travels with the code.

### 3.2 E2E tests in Playwright 🎭
- Use **Playwright** for the end-to-end / UI tests against the running frontend.
- **You decide what to cover.** Explore the app (see the features in §1), identify the user journeys and edge cases that matter, and prioritize them. Deciding *what's worth testing* is part of what we're assessing — so we're deliberately not handing you a checklist here.
- Use **stable selectors** rather than brittle CSS/XPath. The app is annotated with **`data-test` attributes** on key elements (e.g. `[data-test="new-task-text"]`, `[data-test="add-task-button"]`, `[data-test="todo-item"]`, `[data-test="delete-button"]`) — prefer these (or accessible roles/labels). Inspect the DOM to discover the full set.
- Tests must be **independent** and **repeatable** — each test should set up and clean up its own data (see seeding, 3.4).
- Avoid hard-coded `sleep`/fixed waits; use Playwright's auto-waiting / web-first assertions.

### 3.3 API tests (calling the backend directly) 🔌
- Write tests that hit the REST API **directly**, without going through the UI (you may use Playwright's `request` fixture, or another HTTP client of your choice — tell us what and why).
- Cover all 5 endpoints (see the table in §1), including the **negative / edge cases you think matter** — identifying those is part of the exercise, so we're not listing them here.
- Where it makes sense, verify the API and the persisted file stay consistent.

### 3.4 Testing with a database seed 🌱
- The "database" in this project is the JSON file **`backend/todos.json`**.
- Demonstrate **seeding**: load a known set of todos into a clean, predictable state **before** tests run, so tests don't depend on each other or on leftover data.
- Provide a **seed file** (e.g. a JSON fixture) and the mechanism you use to apply it (a script, a fixture, a `beforeEach` hook — your choice).
- Show how you **reset / clean up** state between tests or runs.
- Briefly explain in your README how seeding works and how to change the seed data.

> 💡 You may reset state either by writing the seed JSON directly to `backend/todos.json`, or by driving the API to build a known state. Pick an approach, make it work reliably, and justify it.

### 3.5 Project organization & architecture 🗂️
- Lay out the test project so it's easy to navigate and scale. We want to see deliberate structure, e.g.:
  - Separation of **E2E** vs **API** tests.
  - Reusable helpers / fixtures / page objects (or an equivalent pattern) instead of copy-pasted code.
  - Centralized config (base URLs, ports, timeouts) — no magic values scattered around.
  - Test data / seed fixtures kept separate from test logic.
- Include a clear **README** for your test project explaining how to install, seed, and run everything (one command to run all tests is ideal).

### 3.6 Test report 📊
- Produce a **test report** from a real run.
- The Playwright **HTML report** is perfectly acceptable — include instructions to generate/open it, and/or commit the generated report.
- A short written summary is a plus: how many tests, pass/fail, any **bugs or surprising behavior** you found, and your overall assessment of the app's quality.

### 3.7 AI usage disclosure 🤖
- Using AI tools is **allowed and welcome** — but you must be transparent about it.
- If you used AI to complete any part of this task, include a short write-up covering:
  - **Which AI tools** you used (e.g. ChatGPT, Claude, Copilot, etc.).
  - **How you approached the work** with them — what you delegated, what you did yourself, and how you reviewed/validated the output.
- **Provide a copy of your conversation logs** (export or transcript) as part of your submission.
- If you did **not** use AI, simply state that.

> We're not penalizing AI use — we want to understand your process and confirm you can explain everything you deliver.

### 3.8 Recorded screenshare walkthrough 🎥
- Record a short **screenshare video** (voice-over) walking us through your project. Please cover:
  - **Your overall approach** to the project.
  - A **brief summary of your test plan**.
  - An **overview of your Playwright (E2E) testing** approach and implementation.
  - An **overview of your API testing** approach and implementation.
- Keep it concise and focused (a tight ~5–15 minutes is plenty).
- Include the video as a **shareable link** (e.g. Loom, Google Drive, YouTube unlisted) in your submission / PR description.

### 3.9 Anything else you think matters ➕
This is your space to shine. Optional ideas (none required):
- Running tests in **CI** (e.g. a GitHub Actions workflow).
- Cross-browser runs, parallelization, or trace/video on failure.
- Accessibility, basic performance, or visual checks.
- A short note on what you'd test next if you had more time.

---

## 4. Bugs and observations 🐛

This app is intentionally simple and **may contain bugs or rough edges**. If you find behavior that seems wrong, **don't fix it** — instead:
- Document it clearly (steps to reproduce, expected vs actual).
- Decide whether your test should assert the *correct* behavior (and fail) or the *current* behavior — and **explain your choice**.

Finding and clearly reporting real issues is a strong positive signal.

---

## 5. Ground rules

- ✅ **Do** write your own tests, helpers, config, README, and docs.
- ✅ **Do** keep the app code itself unchanged (don't modify `backend/` or `frontend/` source to make tests pass).
- ❌ **Don't** worry about authentication, real databases, or deploying anything.
- You may use AI tools — but **you must understand and be able to explain every part** of what you deliver, and you must **disclose your AI usage and share your conversation logs** (see §3.7). We will discuss it with you.

---

## 6. How to submit

Submit your work as a **branch + Pull Request**:

- Create a **branch** off `main` (e.g. `qa/<your-name>`).
- Place your test project in a clearly named folder (e.g. `qa-tests/` at the repo root) — keep it separate from `backend/` and `frontend/`.
- Open a **Pull Request** against `main` and use the PR description as your cover note (summary of what you did, how to run it, and links to your test report, worksheet, **screenshare video** (§3.8), and **AI usage write-up + conversation logs** (§3.7)).
- Make sure a reviewer can, from a clean checkout of your branch:
  1. Install dependencies.
  2. Start the app.
  3. Seed the data.
  4. Run all tests.
  5. Open the report.
- Document those exact steps in your test project's README.

**Submission checklist** — make sure your PR includes:
- [ ] E2E (Playwright) tests
- [ ] API tests
- [ ] Test plan worksheet
- [ ] Seed file + seeding/reset mechanism
- [ ] Test report
- [ ] AI usage write-up + conversation logs (or a note that you didn't use AI)
- [ ] Screenshare walkthrough video link
- [ ] Test project README

---

## 7. How we'll evaluate 🎯

| Area | What we look for |
|------|------------------|
| **Test plan** | Clear scope, risk-based prioritization, readable cases, happy + negative paths |
| **E2E (Playwright)** | Meaningful coverage, robust selectors, independent & stable tests, good assertions |
| **API tests** | All endpoints, negative cases, status codes & payloads validated |
| **Seeding** | Clean, repeatable state; clear seed/reset mechanism |
| **Architecture** | Logical structure, reuse (fixtures/POM), centralized config, no duplication |
| **Reporting** | A real report + a useful summary of results and findings |
| **Communication** | Clear README & docs; bugs reported well; reasoning explained |
| **AI transparency** | Honest disclosure of AI tools used, how, and conversation logs provided |
| **Walkthrough video** | Clear narration of approach, test plan, and E2E/API implementation |
| **Extras** | Thoughtful additions (CI, traces, a11y, etc.) |

---

### Questions?
If something is ambiguous, make a reasonable assumption, **write it down** in your docs, and proceed. How you handle ambiguity is part of what we're assessing.

Good luck — we're looking forward to seeing how you work! 🚀
