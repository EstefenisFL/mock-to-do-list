AI Usage Disclosure
AI Tool Used
Inner AI – session:
https://app.innerai.com?sharedSessionId=a328a46a-aee8-45e5-816d-1f9c1fe74764

How AI Was Used
I used Inner AI as a support tool while working on the QA assignment for the Mock To-Do List application.
The main areas where I asked for help were:

Understanding the challenge instructions and structuring a step‑by‑step approach.
Designing the overall layout of the qa-tests project (folders, config, scripts).
Getting guidance on how to implement a seeding/reset mechanism for backend/todos.json.
Drafting an initial GitHub Actions workflow to run backend, frontend, and Playwright tests in CI.
Getting suggestions for how to organize E2E vs API tests, and how to document them (README, test plan, AI usage write‑up).
The assistant also provided example code snippets (e.g., playwright.config, seed scripts, workflow YAML) and high‑level explanations, which I used as references.

What I Did Myself
I ran and explored the application manually, performed exploratory testing, and identified relevant scenarios and bugs.
I created and adapted the actual test files (E2E and API), page objects, seed data, and scripts to match the real behavior of the app.
I implemented and adjusted the CI pipeline so it works with this specific project (paths, commands, waits, environment variables).
I decided which AI suggestions to keep, modify, or discard based on my QA judgement and what actually passed in the app and pipeline.
In other words, AI was used as a helper, not as an auto‑pilot: I remained responsible for the design, implementation, and final decisions.

Validation of AI Output
All AI suggestions were manually reviewed and adapted before being added to the codebase.
I verified changes by running the tests locally (Playwright) and in the GitHub Actions pipeline.
Whenever an AI suggestion didn’t match the real behavior of the application (for example, paths, timeouts, or seed strategy), I updated or corrected it.
Areas Specifically Assisted
High‑level plan to structure the QA project (qa-tests folder, test plan, fixtures, scripts).
Example structures for:
Playwright configuration (projects, baseURL, reporter, trace/video settings).
Seed/reset scripts for the JSON “database”.
GitHub Actions workflow steps (install, start backend/frontend, wait, run tests, upload report).
Drafting documentation text:
PR description and summary of the QA work.
AI usage disclosure itself.
Outline of the screenshare walkthrough script.
Conversation Logs
Conversation logs for this assignment are available here (Inner AI shared session):

https://app.innerai.com?sharedSessionId=a328a46a-aee8-45e5-816d-1f9c1fe74764
If needed, I can provide additional exports or screenshots from this session.