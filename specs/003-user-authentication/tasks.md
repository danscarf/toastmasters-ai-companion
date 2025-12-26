# Implementation Tasks: User Authentication

This document outlines the development tasks required to implement the "User Authentication" feature using Supabase.

## Phase 1: Supabase Integration & Basic Auth

1.  **T039**: Initialize Supabase Project and Vercel Integration (Done by user).
2.  **T040**: [x] Integrate Supabase SDK: Install `@supabase/supabase-js` and configure the Supabase client in the Next.js application using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3.  **T041**: [x] Implement Authentication UI: Create pages for login (`/auth/login`), registration (`/auth/signup`), and password reset (`/auth/reset-password`).
4.  **T042**: [x] Implement Authentication Logic: Use Supabase Auth to handle user sign-up, sign-in, and sign-out, integrating with the UI components.

## Phase 2: Secure Gemini API Calls & Route Protection

5.  **T043**: [x] Protect Routes: Implement middleware or server-side checks to protect the `/timer` page, ensuring only authenticated users can access it.
6.  **T044**: [x] Create Supabase Edge Function for Gemini: Develop and deploy a Supabase Edge Function that handles the call to the Gemini API, securely using `SUPABASE_SERVICE_ROLE_KEY` and eliminating the need for `GEMINI_API_KEY` in Vercel.
7.  **T045**: [x] Refactor `/api/process-agenda` to call the new Supabase Edge Function instead of the direct Gemini API.

## Phase 3: User Data Persistence & Integration

8.  **T046**: [x] **Set up TypeORM & `TimerSession` Entity**: Install `typeorm` and `pg`, create a TypeORM connection configuration, and define a TypeORM `Entity` for `TimerSession`.
9.  **T047**: [x] **Integrate TypeORM with `TimerProvider`**: Update the `TimerProvider` to save `TimerSession` data to the Supabase PostgreSQL database using TypeORM.
