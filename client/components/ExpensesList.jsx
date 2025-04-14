import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense, updateExpense } from '../services/api';
import '../styles/ExpensesList.scss';

const ExpensesList = ({ expensesList, setExpensesList, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await getExpenses();
        setExpensesList(data);
        setUseMockData(false);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [setExpensesList]);

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
      console.log('Expense deleted successfully'); // Debugging log
      await onSubmitSuccess(); // Re-fetch expenses
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // handle edit button click
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  };

  // handle save after editing
  const handleEdit = async (updatedExpense) => {
    try {
      await updateExpense(updatedExpense.expense_id, updatedExpense);
      console.log('Expense updated successfully'); // Debugging log
      await onSubmitSuccess(); // Re-fetch expenses

      // Close the modal after saving
      setEditingExpense(null);
    } catch (error) {
      console.error('Error editing expense:', error);
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
            handleEdit(editingExpense);
          }}
        >
          <label>
            Amount:
            <input
              type="number"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, amount: e.target.value })
              }
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={editingExpense.expense_date.split('T')[0]}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, expense_date: e.target.value })
              }
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              value={editingExpense.category}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, category: e.target.value })
              }
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={editingExpense.name}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, name: e.target.value })
              }
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingExpense(null)}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="expenses-list">
      <h2>Your Expenses</h2>

      {expensesList.length === 0 ? (
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
              {expensesList.map((expense) => (
                <tr key={expense.expense_id}>
                  <td className="amount">${Number(expense.amount).toFixed(2)}</td>
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
                <td className="total-amount">
                  $
                  {expensesList
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
