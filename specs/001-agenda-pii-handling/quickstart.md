# Quickstart: Agenda PII Handling

This guide provides the basic steps to set up and run the RoleCopilot application to test the "Agenda PII Handling" feature.

## Prerequisites

- Node.js (version 20.x or later)
- npm or yarn

## 1. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository-url>
cd rolecopilot-dev
npm install
```

## 2. Environment Variables

The application may require environment variables for connecting to external services (like an LLM). Create a `.env.local` file in the root of the project and add the necessary keys.

For this feature, no environment variables are strictly required for the core functionality, but you can set up a placeholder for future LLM integration.

```text
# .env.local
LLM_API_KEY="your-api-key-here" # Not used by the core PII-handling feature
```

**Note**: The `.env.local` file is ignored by Git and should not be committed.

## 3. Running the Application

Start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 4. How to Test the Feature

1.  Navigate to the main page of the application.
2.  You should see a UI element for uploading a file.
3.  Select a text-based PDF of a meeting agenda.
4.  Upon successful upload, the application will process the file.
5.  A list of extracted roles and their assigned members will be displayed on the screen.
6.  Verify that the displayed information is correct.
7.  Close the browser tab and reopen it. The data should be gone, demonstrating that it was held only in memory for the session.
