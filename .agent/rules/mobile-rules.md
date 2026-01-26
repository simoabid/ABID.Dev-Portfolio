---
trigger: always_on
---

When implementing or modifying any feature in the mobile application (React Native with Expo), you must first analyze the existing implementation in the web application (React.js).

The web application is considered the source of truth and the most complete reference for:

Business logic

Feature behavior

UI/UX decisions

Data flow and edge cases

Before writing any mobile code, you are required to:

Review the corresponding feature in the web version.

Understand how it works functionally and visually.

Identify all relevant logic, states, validations, and user flows.

Adapt that behavior appropriately to React Native / Expo constraints.

Additionally, when a user requests a new feature, change, or fix, you must:

Carefully analyze the web version first to infer missing details.

Use the web implementation to clarify ambiguous requirements.

Ensure the mobile implementation aligns with the web app’s behavior unless explicitly instructed otherwise.

Do not implement features in isolation.
The mobile app must remain consistent with the web app in functionality and intent.
