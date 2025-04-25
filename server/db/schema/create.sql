-- Drop the tables if they already exist
DROP TABLE IF EXISTS Income CASCADE;
DROP TABLE IF EXISTS Expenses CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS SavingsGoals CASCADE;
DROP TABLE IF EXISTS Trophies CASCADE;
DROP TABLE IF EXISTS User_Trophies CASCADE;
DROP TABLE IF EXISTS Badge_Trophies CASCADE;


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

-- Create TROPHIES table
CREATE TABLE Trophies (
  trophy_id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  percent_required INTEGER NULL CHECK (percent_required >= 0 AND percent_required <= 100),
  icon_url TEXT NOT NULL
);

-- Create badge_trophies table
CREATE TABLE Badge_Trophies (
  trophy_id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_path TEXT NOT NULL,
  criteria_key TEXT NOT NULL
);

-- Create USER_TROPHIES table to track with Users have earned which Trophies
CREATE TABLE User_trophies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
  trophy_id INTEGER REFERENCES Trophies(trophy_id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES Badge_Trophies(trophy_id) ON DELETE CASCADE,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type TEXT CHECK (type IN ('badge', 'trophy')) NOT NULL
);


-- Add partial unique indexes
CREATE UNIQUE INDEX unique_user_badge
ON user_trophies(user_id, badge_id)
WHERE type = 'badge';

CREATE UNIQUE INDEX unique_user_trophy
ON user_trophies(user_id, trophy_id)
WHERE type = 'trophy';

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

