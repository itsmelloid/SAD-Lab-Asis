# SAD-Lab-Asis — Student Record Management System

A simple CRUD web app for managing student records. Built for the Systems Analysis and Design 3-hour laboratory.

## Functions
- **Create** – add a student (Student ID, Full Name, Program, Year Level, Email)
- **Read** – view all saved records in a table (with search)
- **Update** – click *Edit*, change the data, click *Update*
- **Delete** – click *Delete*; a confirmation appears before removal
- Input validation and duplicate Student ID detection

## Tech
HTML, CSS, JavaScript (no framework) · **Database: Supabase (PostgreSQL)** · GitHub + GitHub Pages

## Setup
1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase-setup.sql` (creates the `students` table, access policies, and 5 sample records).
3. In **Project Settings → API**, copy the *Project URL* and *anon public* key into `config.js`.
4. Open `index.html` (or serve with `npx serve`). The badge should read **Supabase connected**.

## Database table: `students`
| Column | Type | Notes |
|---|---|---|
| id | bigint | primary key, auto-generated |
| student_id | text | unique, required |
| full_name | text | required |
| program | text | required |
| year_level | smallint | 1–6 |
| email | text | required |
| created_at | timestamptz | default now() |

## Deployment (GitHub Pages)
Push to a repo named `SAD-Lab-Lastname` → **Settings → Pages → Deploy from branch → main / root**.
Live URL: `https://<username>.github.io/SAD-Lab-Lastname/`

> The anon key is designed to be public, but the lab's open Row Level Security policies mean anyone with the link can edit data. Fine for a lab; not for production.

## Developer
John Lloyd Asis — 3B / BSIT
