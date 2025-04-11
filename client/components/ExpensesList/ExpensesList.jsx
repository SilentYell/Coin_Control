import React, { useState } from 'react';
import './ExpensesList.scss';

const ExpensesList = () => {
  // mock data based on schema
  const [expenses, setExpenses] = useState([
    {
      expense_id: 1,
      user_id: 1,
      amount: 45.99,
      expense_date: '2025-04-05',
      category: 'Groceries',
      description: 'Weekly grocery shopping',
    },
    {
      expense_id: 2,
      user_id: 1,
      amount: 12.5,
      expense_date: '2025-04-07',
      category: 'Transportation',
      description: 'Bus fare',
    },
    {
      expense_id: 3,
      user_id: 1,
      amount: 89.99,
      expense_date: '2025-04-08',
      category: 'Entertainment',
      description: 'Concert tickets',
    },
    {
      expense_id: 4,
      user_id: 1,
      amount: 199.99,
      expense_date: '2025-04-09',
      category: 'Utilities',
      description: 'Electricity bill',
    },
  ]);
};
