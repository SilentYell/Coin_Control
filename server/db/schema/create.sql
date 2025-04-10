-- Drop the tables if they already exist
DROP TABLE IF EXISTS Income;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Users;

-- Create USERS table
CREATE TABLE Users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL
);

-- Create EXPENSES table with a foreign key to USERS
CREATE TABLE Expenses (
  expense_id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  expense_date DATE NOT NULL,
  category VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create INCOME table with a foreign key to USERS
CREATE TABLE Income (
  income_id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  frequency VARCHAR(20) NOT NULL,
  last_payment_date DATE NOT NULL,
  next_payment_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);