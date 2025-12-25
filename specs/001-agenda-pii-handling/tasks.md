# Implementation Tasks: Agenda PII Handling (Text-to-JSON)

This document outlines the development tasks required to implement the "Agenda PII Handling" feature. The tasks are organized into phases, with each phase representing a logical step towards completion.

## Phase 1: Project Initialization & Setup

This phase covers the initial project scaffolding and security planning.

- [x] T001 Initialize a new Next.js project in the current directory using `npx create-next-app@latest` with TypeScript, ESLint, and Tailwind CSS.
- [x] T002 Create a threat model document based on FR-017 in `specs/001-agenda-pii-handling/threat-model.md`
- [x] T003 Create a `.env.local` file for the `GEMINI_API_KEY` environment variable.
- [x] T004 **[Security]** Install and configure the `eslint-plugin-security` package to add static analysis for security vulnerabilities into the linting process.

## Phase 2: Foundational Libraries

This phase focuses on creating the core, reusable logic for PII sanitization and AI interaction. These can be developed in parallel.

- [x] T005 [P] Implement PII sanitization function in `app/_lib/pii.ts`. It must accept text and a list of attendee names, returning sanitized text and a token-to-name map.
- [x] T006 [P] Implement the Gemini service in `app/_lib/gemini.ts`. This will initialize the client and export a function that takes sanitized prompt text and returns structured JSON.
- [x] T007 [P] **[Security]** Update the PII sanitizer in `app/_lib/pii.ts` to use randomized, non-sequential tokens (e.g., `[PII_w3d8s2]` instead of `[PERSON_1]`) to mitigate in-memory pattern inference attacks.
- [x] T008 [P] **[Security]** Harden the system prompt in `app/_lib/gemini.ts` with strong delimiters and explicit instructions for the model to disregard any instructions in the user-provided text, mitigating prompt injection attacks.

## Phase 3: User Story 1 - Secure Agenda Processing

This phase implements the core user-facing feature as defined in User Story 1.

**User Story Goal**: As a user, I want to paste agenda text, have it processed securely, and see the structured roles displayed.
**Independent Test Criteria**: A user can paste text, and the system displays the correct roles and assignees without PII being sent to the AI service.

- [x] T009 [US1] Implement the API route in `app/(api)/process-agenda/route.ts`. This route will coordinate the PII sanitization and Gemini service calls.
- [x] T010 [P] [US1] Create the state management context in `app/_providers/AgendaProvider.tsx` to handle loading states, errors, and role data.
- [x] T011 [P] [US1] Create the input component `app/_components/agenda/AgendaInput.tsx` with a text area and a submission button.
- [x] T012 [P] [US1] Create the display component `app/_components/agenda/RoleDisplay.tsx` to render the list of extracted roles.

## Phase 4: Integration & Polish

This final phase brings all the pieces together and refines the user experience.

- [x] T013 [US1] Integrate `AgendaProvider`, `AgendaInput`, and `RoleDisplay` into the main page `app/page.tsx`.
- [x] T014 [US1] Implement UI feedback for loading and error states within the components.
- [x] T015 [P] [US1] Apply Tailwind CSS styling to all created components for a polished and responsive layout.

## Phase 5: Security Hardening

This phase applies runtime security measures to the application.

- [x] T016 **[Security]** Configure a strict Content Security Policy (CSP) and other security headers in `next.config.js` to protect against XSS and other injection attacks.
- [x] T017 **[Security]** Implement and configure CORS headers in `app/(api)/process-agenda/route.ts` to restrict access to the API endpoint.

## Dependencies

-   **User Story 1 (US1)** is dependent on the completion of **Phase 2**.
-   **Phase 5** is dependent on the completion of **Phase 3 and 4**.

## Parallel Execution

-   Tasks marked with `[P]` can be worked on in parallel.
-   Within **Phase 2**, the `pii.ts` and `gemini.ts` libraries are independent and can be developed simultaneously.
-   Within **Phase 3**, the API route (`T009`) can be developed in parallel with the UI state (`T010`) and components (`T011`, `T012`).

## Implementation Strategy

The implementation will follow an MVP-first approach, focusing on completing the end-to-end flow for User Story 1. The foundational libraries will be built first, followed by the API and UI, and then integrated for a fully functional feature. Security hardening is applied after the core functionality is in place.
