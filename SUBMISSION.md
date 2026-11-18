# Required Submission Checklist

1. GitHub Repository Link: https://github.com/<username>/SAD-Lab-Asis
2. Deployed System Link: https://<username>.github.io/SAD-Lab-Lastname/
3. Screenshot of the working system: (attach)
4. Screenshot of Supabase Table Editor showing ≥ 5 records: (attach)

## Short System Design Summary
- **System name:** Student Record Management System
- **Purpose:** Store and manage basic student information in one place, replacing paper/spreadsheet lists.
- **Users:** School staff / registrar personnel (and instructors with access).
- **Input:** Student ID, Full Name, Program, Year Level, Email (entered through a web form).
- **Process:** The browser validates input, then JavaScript sends Create / Read / Update / Delete requests to Supabase; the table refreshes after each change; deletion requires confirmation.
- **Output:** A table of all student records, with success/error messages.
- **Database used:** Supabase (PostgreSQL), table `students`.

## Testing Checklist
- [ ] Can a student record be added?
- [ ] Are all student records displayed correctly?
- [ ] Can an existing record be edited?
- [ ] Can a record be deleted?
- [ ] Does the database retain the records (after refresh)?
- [ ] Does the deployed application work correctly after refreshing?
