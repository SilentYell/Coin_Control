import React, { useState, useEffect, useRef } from 'react';
import { getExpenses, deleteExpense, updateExpense } from '../services/api';
import '../styles/ExpensesList.scss';
import { MdEdit, MdDelete } from 'react-icons/md';

const ExpensesList = ({ expensesList, setExpensesList, onSubmitSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const editAmountInputRef = useRef(null);

  const categories = [
    'Groceries',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Housing',
    'Healthcare',
    'Education',
    'Personal',
    'Other',
  ];

  // to calculate total after expenses are loading for colour
  const total = expensesList.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // filter expenses by selected category
  const filteredExpenses =
    selectedCategory === 'All'
      ? expensesList
      : expensesList.filter((expense) => expense.category === selectedCategory);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await getExpenses();
        setExpensesList(data);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    //only fetch if there is no data
    if (!expensesList || expensesList.length === 0) {
      fetchExpenses();
    }
  }, []); //empty dependency array - only run on mount

  // format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (editingExpense && editAmountInputRef.current) {
      editAmountInputRef.current.focus();
    }
  }, [editingExpense]);

  // handle delete expense
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      console.log('Expense deleted successfully'); // Debugging log
      // update locally instead of fetching again
      setExpensesList((prevList) =>
        prevList.filter((expense) => expense.expense_id !== id)
      );
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
      const expenseToSave = {
        ...updatedExpense,
        amount: -Math.abs(parseFloat(updatedExpense.amount)), // Ensure negative
      };
      await updateExpense(expenseToSave.expense_id, expenseToSave);
      console.log('Expense updated successfully');
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
          <div className="form-group">
            <label htmlFor="edit-amount">Amount ($)</label>
            <input
              ref={editAmountInputRef}
              id="edit-amount"
              type="number"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  amount: e.target.value, // Store as entered
                })
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
            <select
              id="edit-category"
              value={editingExpense.category}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  category: e.target.value,
                })
              }
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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

      {/* Add category filter */}
      <div className="filter-controls">
        <label htmlFor="category-filter">Filter by category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option key="All" value="All">
            All
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
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
                {/* OA - Kept "Actions" th for styling structure but header seemed unnecessary as buttons are intuitive */}
                <th className='actions-header' aria-hidden="true"></th> 
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.expense_id}>
                  <td className="amount">
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td>{formatDate(expense.expense_date)}</td>
                  <td>
                    <span className={`category-tag ${expense.category}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="description">{expense.name}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(expense)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.expense_id)}
                    >
                      <MdDelete />
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
