# Research: Agenda PII Handling

This document records the research and decisions made to resolve ambiguities in the implementation plan.

## 1. PDF Text Extraction in a Next.js Serverless Environment

**UNKNOWN**: The initial plan proposed `pdf-lib` for PDF parsing but marked for clarification its server-side compatibility and, crucially, its text extraction capabilities.

**RESEARCH**:
- `pdf-lib` is excellent for creating and modifying PDF documents. However, it does **not** have built-in functionality for text extraction. Its primary focus is on manipulating the PDF structure itself (adding pages, drawing shapes, embedding fonts/images), not on interpreting the content stream to extract text.
- `pdf-parse`: A popular and robust library for Node.js that specializes in text extraction from PDF files. It's a wrapper around `pdf.js` by Mozilla. It runs smoothly in a Node.js environment, making it suitable for Next.js API routes (serverless functions).
- `pdf.js`: The underlying engine for `pdf-parse`, maintained by Mozilla. It can be used directly, but `pdf-parse` provides a much simpler, promise-based API for the common use case of extracting all text content.

**DECISION**: Use the `pdf-parse` library for extracting text from uploaded agenda PDFs.

**RATIONALE**:
- It is specifically designed for text extraction, which is the core requirement.
- It has a straightforward API, reducing implementation complexity.
- It is well-maintained and widely used in the Node.js ecosystem, ensuring good support and stability within our Next.js backend.
- It handles the complexity of the PDF content stream internally, providing simple text output.

**ALTERNATIVES CONSIDERED**:
- **`pdf-lib`**: Rejected because it lacks text extraction capabilities.
- **Using an external API/service**: Rejected as it introduces another third-party dependency and potential privacy concerns, which contradicts the feature's core security principles.
- **`Tesseract.js` (OCR)**: Rejected because it's for Optical Character Recognition from images. The feature spec assumes text-based PDFs, making OCR unnecessary overhead and prone to inaccuracies.

## 2. Secure API Key Management in Next.js

**UNKNOWN**: How to securely manage the LLM API key for potential future use, ensuring it's not exposed to the client-side.

**RESEARCH**:
- Next.js supports environment variables that are only available on the server-side.
- By prefixing an environment variable with `NEXT_PUBLIC_`, it becomes available in the browser. Without this prefix, it remains private to the server environment.
- These variables can be stored in a `.env.local` file at the root of the project. This file is listed in `.gitignore` by default in Next.js projects and should never be committed to source control.

**DECISION**: The LLM API key will be stored in a `.env.local` file without the `NEXT_PUBLIC_` prefix (e.g., `LLM_API_KEY=...`).

**RATIONALE**:
- This is the standard, secure method recommended by the Next.js documentation.
- It ensures that the API key is never bundled with the client-side JavaScript, preventing it from being exposed to users.
- The key can be accessed securely from within Next.js API routes (serverless functions) via `process.env.LLM_API_KEY`.

## 3. In-Memory Session Data Management in React

**UNKNOWN**: Best practice for managing the temporary, in-memory session data (extracted roles and names) on the client-side.

**RESEARCH**:
- **React State (`useState`)**: Suitable for managing state within a single component.
- **React Context (`useContext` + `useState`)**: The standard, built-in solution for sharing state across multiple components without "prop drilling". A `SessionProvider` component can be created to hold the agenda data and make it available to any child component in the tree.
- **Zustand**: A popular, lightweight state management library. It offers a simpler API than Context for some use cases and can help avoid re-renders.

**DECISION**: Use React Context (`createContext`, `useContext`, `useState`).

**RATIONALE**:
- It is a built-in React feature, requiring no additional third-party dependencies. This aligns with the principle of keeping the stack lean.
- The scope of the session data is well-defined and a global provider at the root of the agenda-processing UI is a clean architectural pattern.
- It's sufficient for the current scale of the feature. If state management becomes significantly more complex in the future, migrating to a library like Zustand would be straightforward.

**ALTERNATIVES CONSIDERED**:
- **Zustand**: A viable alternative, but overkill for the immediate need. Rejected in favor of using a native solution first.
- **`sessionStorage`**: Rejected because it persists data across page reloads, which is not strictly "in-memory". While it's cleared when the tab is closed, React state that is lost on reload provides a cleaner and more explicit data lifecycle for this specific use case.
