-- Drop the tables if they already exist
DROP TABLE IF EXISTS Income CASCADE;
DROP TABLE IF EXISTS Expenses CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS SavingsGoals CASCADE;
DROP TABLE IF EXISTS Trophies CASCADE;
DROP TABLE IF EXISTS User_Trophies CASCADE;


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
  name VARCHAR(100) NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  percent NUMERIC(5,2) NOT NULL,
  saved NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Trophies (
  trophy_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_path TEXT, -- Optional, e.g. emoji or image URL
  criteria_key TEXT UNIQUE -- Used in logic to check eligibility
);

CREATE TABLE User_Trophies (
  user_id INTEGER REFERENCES users(user_id),
  trophy_id INTEGER REFERENCES trophies(trophy_id),
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, trophy_id)
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

