# Tasks: Ahh Counter

This document breaks down the implementation of the "Ahh Counter" feature into actionable tasks.

## Phase 1: Foundational Setup
- [ ] T001 Create `app/_components/ahh-counter/` directory for the feature's components.
- [ ] T002 Implement the `AhhCounterProvider` in `app/_providers/AhhCounterProvider.tsx` to manage state. (Already created)
- [ ] T003 Create the main page for the feature at `app/ahh-counter/page.tsx`. (Already created)

## Phase 2: User Story 1 - Log a Filler Word Event
**Goal**: Allow the user to select a speaker and log filler word events.
**Independent Test**: User can add a speaker, select them, and tap a filler word button to create a log entry.

- [ ] T004 [US1] Create the `SpeakerList` component in `app/_components/ahh-counter/SpeakerList.tsx` to allow adding and selecting speakers.
- [ ] T005 [US1] Create the `AhhCounterControls` component in `app/_components/ahh-counter/AhhCounterControls.tsx` with buttons for each filler word.
- [ ] T006 [US1] Integrate the `AhhCounterProvider`, `SpeakerList`, and `AhhCounterControls` into the main `app/ahh-counter/page.tsx`.

## Phase 3: User Story 2 - View Summary Report
**Goal**: Display a summary report of all logged filler words, aggregated by speaker.
**Independent Test**: After logging events, the user can see a report with correct totals for each speaker.

- [ ] T007 [US2] Create the `AhhCounterReport` component in `app/_components/ahh-counter/AhhCounterReport.tsx` to display the aggregated data from the provider.
- [ ] T008 [US2] Integrate the `AhhCounterReport` component into `app/ahh-counter/page.tsx`.

## Phase 4: User Story 3 - View Role Script
**Goal**: Provide the official Ah-Counter script in a collapsible panel.
**Independent Test**: User can see the script panel on the page and can expand and collapse it to view the script.

- [ ] T009 [US3] Create the `AhhCounterScript` component in `app/_components/ahh-counter/AhhCounterScript.tsx`.
- [ ] T010 [US3] Implement the collapsible panel logic for the script in `app/ahh-counter/page.tsx`.

## Phase 5: Polish
- [ ] T011 Review and refine the UI for all new components.
- [ ] T012 Add comments to any complex code sections.

## Dependencies

- **US1** must be completed before **US2**.
- **US3** is independent and can be implemented in parallel with US1 and US2.

## Implementation Strategy

The feature will be built incrementally, following the user story phases. The MVP (Minimum Viable Product) is the completion of User Story 1.
