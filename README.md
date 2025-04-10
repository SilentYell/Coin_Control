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

### **Week 1 (April 10–16): Core Features**

#### **Full-Time Members**

1. **Finalize Database Schema and Write Migrations:**
- Review the `create.sql` file to ensure the schema matches the app's requirements.
- Ensure foreign key relationships are correct (`Users → Expenses`, `Users → Income`).
- Test the schema by running `create.sql` and `seed.sql` to verify tables and seed data are created correctly.
- Update the `README.md` with instructions for resetting the database.

2. **Build `ExpensesList` and `AddExpenseForm` Components:**

- **`ExpensesList`:**
  - Create a React component to display a list of expenses.
  - Use mock data initially (e.g., an array of expense objects).
  - Add basic styling for the list (e.g., table or card layout).

- **`AddExpenseForm`:**
  - Create a React form component to add a new expense.
  - Include fields for `name`, `amount`, `date`, and `category`.
  - Add a submit button that logs the form data to the console for now.

#### **Part-Time Members**

1. **Implement `/api/expenses` Routes:**

- **GET `/api/expenses`:**
  - Query the database to retrieve all expenses for a user.
  - Return the data as JSON.

- **POST `/api/expenses`:**
  - Accept expense data from the request body.
  - Insert the data into the `Expenses` table.
  - Return the newly created expense as JSON.

- **PUT `/api/expenses/:id`:**
  - Accept updated expense data from the request body.
  - Update the corresponding row in the `Expenses` table.
  - Return the updated expense as JSON.

- **DELETE `/api/expenses/:id`:**
  - Delete the expense with the specified ID from the `Expenses` table.
  - Return a success message.

2. **Build `IncomeList` and `AddIncomeForm` Components:**

- **`IncomeList`:**
  - Create a React component to display a list of income sources.
  - Use mock data initially (e.g., an array of income objects).
  - Add basic styling for the list (e.g., table or card layout).

- **`AddIncomeForm`:**
  - Create a React form component to add a new income source.
  - Include fields for `amount`, `frequency`, and `last payment date`.
  - Add a submit button that logs the form data to the console for now.

---

### **Week 2 (April 17–23): Integration and Dashboard**

#### **Goals**
- Integrate frontend with backend.
- Build the `Dashboard` component to display summary data.

#### **Full-Time Members**

1. **Write API Service Functions for `Expenses` and `Income`:**
- Create a `services/api.js` file in the frontend.
- Write functions to call the backend API:
  - `getExpenses()`: Fetch all expenses.
  - `addExpense(expense)`: Add a new expense.
  - `updateExpense(id, expense)`: Update an expense.
  - `deleteExpense(id)`: Delete an expense.
  - Similarly, write functions for `Income` (e.g., `getIncome()`, `addIncome()`).
- Test these functions using mock data.

2. **Build the `Dashboard` Component:**
- Fetch data for total expenses, total income, and current balance using the API service functions.
- Display the data in a visually appealing way (e.g., cards or a summary section).
- Add mock data initially, then integrate with the backend.

#### **Part-Time Members**

1. **Test and Debug Backend Routes:**
- Use Postman or Insomnia to test all `/api/expenses` and `/api/income` routes.
- Verify that the routes handle edge cases (e.g., invalid data, missing fields).
- Fix any bugs or errors in the backend.

2. **Integrate `IncomeList` and `AddIncomeForm` with Backend:**
- Replace mock data in `IncomeList` with data fetched from the backend using `getIncome()`.
- Update `AddIncomeForm` to send data to the backend using `addIncome()`.
- Test the integration by adding new income sources and verifying they appear in the list.

---

### **Week 3 (April 24–29): Testing and Finalization**

#### **Goals**
- Finalize testing and debugging.
- Polish the UI and ensure all features are functional.

#### **Full-Time Members**

1. **Write Integration Tests for Backend Routes:**
- Use a testing framework like Jest or Mocha.
- Write tests for `/api/expenses` and `/api/income` routes.
- Test scenarios like:
  - Fetching all expenses/income.
  - Adding a new expense/income.
  - Updating an expense/income.
  - Deleting an expense/income.

2. **Add Styling and Animations:**
- Use Sass to style the `Dashboard`, `ExpensesList`, and `IncomeList` components.
- Add animations using Anime.js for transitions (e.g., when adding or deleting items).

#### **Part-Time Members**

**Test the Entire Backend for Edge Cases:**
- Test the backend with invalid data (e.g., missing fields, invalid IDs).
- Ensure the backend returns appropriate error messages and status codes.

**Test the Entire Frontend for Usability:**
- Test the app on different screen sizes to ensure responsiveness.
- Verify that all buttons, forms, and links work as expected.
- Check for any visual inconsistencies or bugs.