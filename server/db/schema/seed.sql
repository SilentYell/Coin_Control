INSERT INTO Users(id, username)
VALUES
  (1,'jdoe'),
  (2, 'awond'),
  (3, 'sitad'),
  (4, 'matte');

INSERT INTO Income(user_id, amount, frequency, last_payment_date)
VALUES
  (1, 2000, 'semi-monthly', TO_DATE('15/02/2025', 'DD/MM/YYYY') ),
  (3, 1800, 'semi-monthly', TO_DATE('01/03/2025', 'DD/MM/YYYY') ),
  (4, 1500, 'semi-monthly', TO_DATE('15/03/2025', 'DD/MM/YYYY')),
  (1, 1200, 'semi-monthly', TO_DATE('01/03/2025', 'DD/MM/YYYY'));



INSERT INTO Expenses(user_id, amount, expense_date, category)
VALUES
  (2, -400, TO_DATE('10/02/2025', 'DD-MM-YYYY'), 'Car Insurance'),
  (1, -1200,TO_DATE('01/03/2025', 'DD-MM-YYYY'), 'Rent'),
  (4, -85, TO_DATE('20/03/2025', 'DD-MM-YYYY'), 'Phone Bill'),
  (4,  -250, TO_DATE('25/03/2025', 'DD-MM-YYYY'), 'Groceries');