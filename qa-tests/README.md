# QA Tests – Mock To-Do List

This folder contains the automated test project for the **Mock To-Do List** application (NestJS backend + Angular frontend), implemented with **Playwright**.

---

## Prerequisites

- Node.js 20+
- npm 10+
- Application running locally:
  - Backend on `http://localhost:3000`
  - Frontend on `http://localhost:4200`
- Playwright installed for the test project (instructions below)

Before running the tests, make sure you can:
- Start the backend (`backend/`) and frontend (`frontend/`)
- Open `http://localhost:4200` and add a task manually
- See that `backend/todos.json` is created and updated by the app

---

## Installation

From the repo root:

```bash
cd qa-tests
npm install
npx playwright install chromium
```

This installs the Playwright test runner and the Chromium browser that will be used for E2E/UI tests.

---

## Seeding & Test Data

In this project, the “database” is the file `backend/todos.json`, which is managed entirely by the backend.  
The test project **does not write directly** to this file. Instead, it seeds data **via the public API**, which keeps tests close to real usage.

### Seed file

- The seed file lives at: `qa-tests/seed/todo-seed.json`
- It contains a minimal, **manually maintained** list of todos used for specific scenarios.
- Example shape:

```json
[
  {
    "text": "Buy groceries",
    "dueDate": "2026-06-10"
  },
  {
    "text": "Read a book",
    "dueDate": null
  }
]
```

The backend fills `id`, `done`, and `createdAt` when creating these items via the `/todos/create` endpoint.

### How seeding works

Seeding is performed via the **Playwright request client** in the test utilities:

1. **Clear state**  
   - Before tests, all existing todos are deleted via the API (`GET /todos/list` + `DELETE /todos/delete/:id`).
2. **Apply seed** (when needed)  
   - For scenarios that require a pre-defined dataset, tests call  
     `apiClient.seedFromFile('qa-tests/seed/todo-seed.json')`, which:
     - Reads the JSON seed file.
     - Clears all todos via the API.
     - Recreates each item using `POST /todos/create`.
3. **Per-test isolation**  
   - In most tests, we simply call `clearAll()` in a `beforeEach` hook and create exactly the data needed for that test (via API or UI), ensuring **independent and repeatable** tests.

You can change the initial test data by editing `seed/todo-seed.json`.  
Any changes will automatically be picked up the next time you run the tests.

---

## Running the tests

From `qa-tests/`:

```bash
# Run all tests (API + E2E/UI)
npm test

# Generate and open the Playwright HTML report
npm run report
```

`npm test` runs both:
- API tests against `http://localhost:3000`
- E2E/UI tests against `http://localhost:4200`

---

## Project Structure

```text
qa-tests/
├── playwright.config.ts   # Playwright configuration
├── package.json           # Test project dependencies and scripts
├── README.md              # This file
├── seed/
│   └── todo-seed.json     # Seed data used for test scenarios
├── test-plan/
│   └── test-plan.csv      # Test plan worksheet (one row per test case)
└── tests/
    ├── api/               # API tests (backend only)
    │   └── todos.api.spec.ts
    ├── e2e/               # E2E / UI tests (frontend + backend)
    │   └── todos.e2e.spec.ts
    └── utils/             # Reusable helpers
        ├── apiClient.ts   # API client (list/create/edit/done/delete + clearAll/seedFromFile)
        └── todoPage.ts    # Page Object for the Angular UI
```

- `tests/api/`: API tests calling the REST API directly (no browser).
- `tests/e2e/`: end-to-end tests using Playwright’s browser automation on the Angular UI.
- `tests/utils/`: shared helpers:
  - **ApiClient** – wraps the `/todos` endpoints and exposes `clearAll` and `seedFromFile`.
  - **TodoPage** – Page Object using stable `data-test` selectors for UI interaction.
- `seed/`: seed JSON file used by `ApiClient.seedFromFile`.
- `test-plan/`: CSV worksheet describing test cases (scope, steps, expected results, severity, priority, status).

---

## Playwright Configuration

Key configuration choices in `playwright.config.ts`:

- `testDir: './tests'` – all tests live under `qa-tests/tests/`.
- `use.baseURL = 'http://localhost:4200'` – E2E tests use this base URL for the frontend.
- `fullyParallel: false` – tests are not run in parallel because the backend uses a single JSON file (`todos.json`) as storage; running tests in parallel could lead to conflicts on the shared file.
- Reporter: HTML + list – generates a human-readable report in `qa-tests/report/`.

---

## Notes & Known Behaviors

- The backend uses a single JSON file (`backend/todos.json`) as its datastore.  
  To keep test runs deterministic:
  - Tests run **serially** (`fullyParallel: false`).
  - Each test cleans up its own data (via `clearAll()` or seed reload).
- Tests are designed to be **independent and repeatable**:
  - No test depends on data left by another test.
  - All required state is created via API or UI within the test or its setup.

### Bugs / Observations

As part of the assignment, any discovered issues are documented separately (e.g. in a `BUGS.md`) and referenced from the test report and code comments.  
Example: the current implementation of the max-todo limit in the backend allows 11 items instead of 10, due to a `>` vs `>=` condition. This is covered and documented in the API tests rather than fixed in the app code.

---

## Test Plan

The detailed test plan is stored in `test-plan/test-plan.csv` and includes:

- API and E2E/UI scenarios
- Happy paths and negative / edge cases
- Preconditions, steps, expected results
- Severity, priority, and current execution status

This file is meant as a quick, scannable overview of what is covered and how.

---

For more details on specific tests (E2E vs API, seeding mechanics, or bug findings), see:
- `tests/api/todos.api.spec.ts`
- `tests/e2e/todos.e2e.spec.ts`
- `tests/utils/apiClient.ts`
- `tests/utils/todoPage.ts`