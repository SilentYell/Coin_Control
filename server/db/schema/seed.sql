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


-- Insert trophy data into the Trophies table
INSERT INTO Trophies(trophy_id, name, description, percent_required, icon_url)
VALUES
  (1, 'Bronze Saver', 'Reached 25% of Savings Goal', 25, '/icons/bronze.png'),
  (2, 'Silver Saver', 'Reached 50% of Savings Goal', 50, '/icons/silver.png'),
  (3, 'Gold Saver', 'Reached 75% of Savings Goal', 75, '/icons/gold.png'),
  (4, 'Platinum Saver', 'Reached 100% of Savings Goal', 100, '/icons/platinum.png');

-- Insert icon trophy data
INSERT INTO badge_trophies(name, description, icon_path, criteria_key)
VALUES
  ('First steps', 'Add your first income or expense', 'trophies/first_transaction.png', 'first_transaction'),
  ('Savings Starter', 'Set your first savings goal', 'trophies/first_savings.jpg', 'first_savings'),
  ('Consistent Logger', 'Add a transaction every day for 7 days', 'trophies/consistent_logger.svg', 'transaction_for_7_days'),
  ('Goal Getter', 'Reach a savings goal', 'trophies/equal_to_goal.png', 'equal_to_goal'),
  ('All-In-One', 'Use all features at least once (income, expense, goal, etc.)', 'trophies/use_all_features.png', 'use_all_features'),
  ('Small Saver', 'Save $10', 'trophies/save_10.svg', 'save_income_10'),
  ('Medium Saver', 'Save $50', 'trophies/save_50.svg', 'save_income_50'),
  ('Big Saver', 'Save $100', 'trophies/save_100.svg', 'save_income_100'),
  ('HUGE Saver', 'Save over $1,000', 'trophies/save_1000.png', 'save_income_1000'),
  ('Small Spender', 'Spend $10', 'trophies/spend_10.svg', 'spend_10'),
  ('Medium Spender', 'Spend $50', 'trophies/spend_50.svg', 'spend_50'),
  ('Big Spender', 'Spend $100', 'trophies/spend_100.svg', 'spend_100'),
  ('HUGE Spender', 'Spend over $1,000', 'trophies/spend_1000.svg', 'spend_1000');

-- Insert user trophies
INSERT INTO User_Trophies (user_id, trophy_id, badge_id, awarded_at, type)
VALUES
  (1, null, 3, '2025-04-01 01:18:36', 'badge'),
  (2, null, 2, '2025-04-01 01:18:36', 'badge'),
  (3, null, 4, '2025-02-11 01:18:36', 'badge'),
  (2, null, 5, '2025-01-18 01:18:36', 'badge'),
  (4, null, 6, '2025-01-23 01:18:36', 'badge');

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