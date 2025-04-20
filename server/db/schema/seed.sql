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