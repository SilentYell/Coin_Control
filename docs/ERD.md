# ERD Documentation

## Entities and Attributes

### Users
// Stores user account info and their current budget balance
- `user_id` (SERIAL, Primary Key) // Unique ID for each user
- `username` (VARCHAR(50), Unique, NOT NULL) // User's login name
- `password_hash` (VARCHAR(255), NOT NULL) // Hashed password for security
- `current_balance` (NUMERIC(15,2)) // Current available funds after income/deductions

### Expenses
// Tracks general expenses like groceries or transportation
- `expense_id` (SERIAL, Primary Key) // Unique ID for each expense
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user who owns this expense
- `name` (VARCHAR(100), NOT NULL) // Expense name (e.g., "Groceries")
- `amount` (NUMERIC(15,2), NOT NULL) // Cost of the expense
- `expense_date` (DATE, NOT NULL) // Date of the expense
- `category` (VARCHAR(50)) // Optional: Category for the expense (e.g., "Food", "Transport")

### Income
// Records user income sources for budget planning
- `income_id` (SERIAL, Primary Key) // Unique ID for each income source
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user receiving income
- `amount` (NUMERIC(15,2), NOT NULL) // Income amount
- `frequency` (VARCHAR(20), NOT NULL) // How often it’s received (e.g., "bi-weekly")
- `last_payment_date` (DATE, NOT NULL) // Most recent payment date
- `next_payment_date` (DATE, NOT NULL) // Predicted next payment date

## Relationships
- **Users 1:N Expenses**
- **Users 1:N Income**