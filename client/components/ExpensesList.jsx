import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense, updateExpense } from '../services/api';
import '../styles/ExpensesList.scss';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  // to calculate total after expenses are loading for colour
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);


  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await getExpenses();
        setExpenses(data);
        setUseMockData(false);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

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
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      const updatedExpenses = await getExpenses();
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('API error when deleting expense:', error);
      setError('Failed to delete expense. Please try again later.');
    }
  };

  // handle edit button click
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  };

  // handle save after editing
  const handleSaveEdit = async (updatedExpense) => {
    try {
      await updateExpense(updatedExpense.expense_id, updatedExpense);
      const updatedExpenses = await getExpenses();
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
      setError('Failed to update expense. Please try again later.');
    }
  };

  // render edit form if editing
  if (editingExpense) {
    return (
      <div className="edit-expense-form">
        <h2>Edit Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit(editingExpense);
          }}
        >
          <div className="form-group">
            <label htmlFor="edit-amount">Amount ($)</label>
            <input
              id="edit-amount"
              type="number"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, amount: e.target.value })
              }
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-date">Date</label>
            <input
              id="edit-date"
              type="date"
              value={editingExpense.expense_date.split('T')[0]}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  expense_date: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-category">Category</label>
            <input
              id="edit-category"
              type="text"
              value={editingExpense.category}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  category: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-name">Description</label>
            <input
              id="edit-name"
              type="text"
              value={editingExpense.name}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, name: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Save
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setEditingExpense(null)}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

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
                  <td className="amount">
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td>{formatDate(expense.expense_date)}</td>
                  <td>
                    <span className="category-tag">{expense.category}</span>
                  </td>
                  <td className="description">{expense.name}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(expense)}
                    >
                      Edit
                    </button>
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
                <td
                  className={
                    'total-amount ' + (total < 0 ? 'negative' : 'positive')
                  }
                >
                  ${total.toFixed(2)}
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
