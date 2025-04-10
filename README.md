# Coin Control
A basic React + Vite frontend and Express backend project.

## Setup
1. **Frontend**: `cd client && npm run dev`
2. **Backend**: `cd server node index.js`

3. **Database**:
    - Start `postgresql` and set up data base

```bash
sudo systemctl start postgresql
npm run db-setup
```

Here’s a detailed weekly and daily plan for your team of 4 to stay on track and complete the project by April 29, 2025. This plan considers your team composition (2 full-time and 2 part-time members) and breaks tasks into manageable chunks.

---

## **Weekly Plan**

#### **Week 1 (April 10–16): Core Features**
**Goals**:
- Finalize database schema and seed data.
- Implement backend routes for `Users`, `Expenses`, and `Income`.
- Build basic frontend components for `Expenses` and `Income`.

**Tasks**:
1. **Full-Time Members**:
   - Member 1: Finalize database schema and write migrations.
   - Member 2: Build `ExpensesList` and `AddExpenseForm` components with mock data.

2. **Part-Time Members**:
   - Member 1: Implement `/api/expenses` routes (`GET`, `POST`, `PUT`, `DELETE`).
   - Member 2: Build `IncomeList` and `AddIncomeForm` components with mock data.

---

#### **Week 2 (April 17–23): Integration and Dashboard**
**Goals**:
- Integrate frontend with backend.
- Build the `Dashboard` component to display summary data.

**Tasks**:
1. **Full-Time Members**:
   - Member 1: Write API service functions for `Expenses` and `Income`.
   - Member 2: Build the `Dashboard` component with mock data.

2. **Part-Time Members**:
   - Member 1: Test and debug backend routes for `Users`, `Expenses`, and `Income`.
   - Member 2: Integrate `IncomeList` and `AddIncomeForm` with backend routes.

---

#### **Week 3 (April 24–29): Testing and Finalization**
**Goals**:
- Finalize testing and debugging.
- Polish the UI and ensure all features are functional.

**Tasks**:
1. **Full-Time Members**:
   - Members 1 & 2: Write integration tests for backend routes. (Do we want to do testing? OR waste of time for now?)

2. **Part-Time Members**:
   - Member 1: Test the entire backend for edge cases.
   - Member 2: Test the entire frontend for usability and responsiveness.

---

### **Daily Guidelines**

#### **Morning Standup (15–30 minutes)**
- Discuss progress and blockers.
- Assign tasks for the day.

#### **Development (4–8 hours)**
- Work on assigned tasks.
- Commit and push changes regularly.

#### **Evening Sync (15–30 minutes)**
- Review progress.
- Test merged features.