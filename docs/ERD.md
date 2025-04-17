# ERD Documentation

## Entities and Attributes

### Users
- `user_id` (SERIAL, Primary Key)
- `username` (VARCHAR(50), Unique, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `current_balance` (NUMERIC(15,2))

### Expenses
- `expense_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `name` (VARCHAR(100), NOT NULL)
- `amount` (NUMERIC(15,2), NOT NULL)
- `expense_date` (DATE, NOT NULL)
- `category` (VARCHAR(50))

### Income
- `income_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `amount` (NUMERIC(15,2), NOT NULL)
- `frequency` (VARCHAR(20), NOT NULL)
- `last_payment_date` (DATE, NOT NULL)
- `next_payment_date` (DATE, NOT NULL)

### SavingsGoals
- `goal_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id))
- `percent` (NUMERIC(5,2), NOT NULL)
- `created_at` (TIMESTAMP, DEFAULT NOW())

## Relationships
- **Users 1:N Expenses**
- **Users 1:N Income**
- **Users 1:N SavingsGoals**