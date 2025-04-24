-- Insert users into the Users table
INSERT INTO Users(username)
VALUES
  ('jdoe'),
  ('awond'),
  ('sitad'),
  ('matte');

-- Insert a demo user with an initial balance
INSERT INTO Users (username, current_balance)
VALUES ('Demo User', 1000.00);

-- Insert income data into the Income table
INSERT INTO Income(user_id, amount, frequency, last_payment_date)
VALUES
  (1, 2000, 'Semi-Monthly', TO_DATE('15/02/2025', 'DD/MM/YYYY')),
  (3, 1800, 'Semi-Monthly', TO_DATE('01/03/2025', 'DD/MM/YYYY')),
  (4, 1500, 'Semi-Monthly', TO_DATE('15/03/2025', 'DD/MM/YYYY')),
  (1, 1200, 'Semi-Monthly', TO_DATE('01/03/2025', 'DD/MM/YYYY'));

-- Insert expenses data into the Expenses table
INSERT INTO Expenses(expense_id, user_id, name, amount, expense_date, category)
VALUES
  (1, 2, 'Car Insurance Payment', -400, TO_DATE('10/02/2025', 'DD/MM/YYYY'), 'Transportation'),
  (2, 1, 'Monthly Rent', -1200, TO_DATE('01/03/2025', 'DD/MM/YYYY'), 'Housing'),
  (3, 1, 'Phone Bill', -85, TO_DATE('20/03/2025', 'DD/MM/YYYY'), 'Utilities'),
  (4, 1, 'Weekly Groceries', -250, TO_DATE('25/03/2025', 'DD/MM/YYYY'), 'Groceries');


INSERT INTO Trophies(name, description, icon, criteria_key)
VALUES
  ('First steps', 'Add your first income or expense', '', 'first_transaction'),
  ('Savings Starter', 'Set your first savings goal', '', 'first_savings'),
  ('Consistent Logger', 'Add a transaction every day for 7 days', '', 'transaction_for_7_days'),
  ('Goal Getter', 'Reach a savings goal', '', 'equal_to_goal'),
  ('All-In-One', 'Use all features at least once (income, expense, goal, etc.)', '', 'use_all_features'),
  ('Small Saver', 'Save $10', '', 'save_income_10'),
  ('Medium Saver', 'Save $50', '', 'save_income_50'),
  ('Big Saver', 'Save $100', '', 'save_income_100'),
  ('HUGE Saver', 'Save over $1,000', '', 'save_income_1000'),
  ('Small Spender', 'Spend $10', '', 'spend_10'),
  ('Medium Spender', 'Spend $50', '', 'spend_50'),
  ('Big Spender', 'Spend $100', '', 'spend_100'),
  ('HUGE Spender', 'Spend over $1,000', '', 'spend_1000');



INSERT INTO User_Trophies (user_id, trophy_id, earned_at)
VALUES
  (1, 1, '2024-12-23 01:18:36'),
  (2, 2, '2025-04-01 01:18:36'),
  (1, 3, '2025-03-04 01:18:36'),
  (3, 4, '2025-02-11 01:18:36'),
  (2, 5, '2025-01-18 01:18:36'),
  (4, 6, '2025-01-23 01:18:36');

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