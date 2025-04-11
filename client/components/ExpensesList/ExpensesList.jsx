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
      name: 'Weekly grocery shopping',
    },
    {
      expense_id: 2,
      user_id: 1,
      amount: 12.5,
      expense_date: '2025-04-07',
      category: 'Transportation',
      name: 'Bus fare',
    },
    {
      expense_id: 3,
      user_id: 1,
      amount: 89.99,
      expense_date: '2025-04-08',
      category: 'Entertainment',
      name: 'Concert tickets',
    },
    {
      expense_id: 4,
      user_id: 1,
      amount: 199.99,
      expense_date: '2025-04-09',
      category: 'Utilities',
      name: 'Electricity bill',
    },
  ]);

  // format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // handle delete expense
  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.expense_id !== id));
  };

  return (
    <div className="expenses-list">
      <h2>Your Expenses</h2>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add an expense to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.expense_id}>
                  <td className="amount">${expense.amount.toFixed(2)}</td>
                  <td>{formatDate(expense.expense_date)}</td>
                  <td>
                    <span className="category-tag">{expense.category}</span>
                  </td>
                  <td className="description">{expense.name}</td>
                  <td className="actions">
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.expense_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="4" className="total-label">
                  Total
                </td>
                <td className="total-amount">
                  $
                  {expenses
                    .reduce((sum, expense) => sum + Number(expense.amount), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
