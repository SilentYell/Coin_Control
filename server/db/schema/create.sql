-- Drop the tables if they already exist
DROP TABLE IF EXISTS Income;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS SavingsGoals;

-- Create USERS table
CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  current_balance NUMERIC(15, 2) DEFAULT 0
);

-- Create INCOME table with a foreign key to USERS
CREATE TABLE Income (
  income_id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  frequency VARCHAR(20) NOT NULL,
  last_payment_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create EXPENSES table with a foreign key to USERS
CREATE TABLE Expenses (
  expense_id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  expense_date DATE NOT NULL,
  category VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create SAVINGS GOALS table with a foreign key to USERS
CREATE TABLE SavingsGoals (
  goal_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(user_id),
  percent NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reset the sequence for the expense_id column
DO $$
DECLARE
  max_id INTEGER;
BEGIN
  SELECT MAX(expense_id) INTO max_id FROM Expenses;
  IF max_id IS NOT NULL THEN
    EXECUTE 'ALTER SEQUENCE expenses_expense_id_seq RESTART WITH ' || (max_id + 1);
  END IF;
END $$;

