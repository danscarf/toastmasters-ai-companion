# Implementation Plan: Agenda PII Handling

**Branch**: `001-agenda-pii-handling` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-agenda-pii-handling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The primary requirement is to securely process meeting agenda PDFs, extracting roles and names without storing or exposing any Personally Identifiable Information (PII) to third-party services. The technical approach is a Next.js web application that parses the PDF in a serverless function, holds data in-memory for the user session, and clears it afterward.

## Technical Context
**Note**: This feature is designed for an anonymous user experience and does not include user authentication. User authentication is planned as a separate, future feature.

**Language/Version**: Node.js 20.x, TypeScript 5.x
**Primary Dependencies**: Next.js, React, Tailwind CSS, pdf-lib (for PDF parsing) - **NEEDS CLARIFICATION**: on server-side compatibility and text extraction capabilities.
**Storage**: N/A for persistent PII. React state and context for in-memory session data.
**Testing**: Jest, React Testing Library, Playwright for end-to-end tests.
**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari).
**Project Type**: Web application.
**Performance Goals**: Process agenda PDF and extract roles in under 15 seconds.
**Constraints**: No persistent storage of PII. PII must not be sent to external LLMs for training.
**Scale/Scope**: Per-user sessions for processing a single agenda at a time.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Specification-First**: A detailed specification exists and has been reviewed.
- [x] **UI-First Prototyping**: A UI prototype is required before implementation. This will be created in an initial task.
- [x] **Test-Driven Development**: The plan includes writing unit, integration, and end-to-end tests.
- [x] **Component-Based Architecture**: The Next.js and React framework enforces a component-based model.
- [x] **Iterative Development**: The feature will be built in stages: PDF upload, parsing, role display, and secure LLM interaction (if any).

## Project Structure

### Documentation (this feature)

```text
specs/001-agenda-pii-handling/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router Structure
app/
├── (api)/
│   └── process-agenda/
│       └── route.ts         # API route for processing the PDF
├── _components/
│   ├── ui/                  # Reusable UI elements (buttons, inputs)
│   ├── agenda/              # Agenda-specific components
│   │   ├── AgendaUploader.tsx
│   │   └── RoleDisplay.tsx
│   └── layout/              # Layout components
├── _lib/
│   ├── pdf.ts               # PDF parsing logic
│   └── pii.ts               # PII stripping and handling logic
├── _hooks/                  # Custom React hooks
├── _providers/              # React context providers
└── page.tsx                 # Main application page

tests/
├── e2e/                     # End-to-end tests (Playwright)
├── integration/             # Integration tests
└── unit/                    # Unit tests (Jest, RTL)
```

**Structure Decision**: The selected structure is the standard Next.js App Router layout. This provides a clear separation of concerns between API logic (`app/(api)`), UI components (`app/_components`), page routes (`app/page.tsx`), and business logic (`app/_lib`). This aligns with the "Component-Based Architecture" principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
