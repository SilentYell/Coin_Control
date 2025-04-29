import React, { useState, useRef, useEffect } from 'react';
import { addExpense, updateExpense } from '../services/api'; // importing api function
import '../styles/AddExpenseForm.scss';
import { initializeExpenseFormData } from '../src/helpers/initializeFormData';
import { getUserTrophies } from '../services/api';

const AddExpenseForm = ({ editingExpense, setEditingExpense, onSubmitSuccess, setEditSuccess, setLastEditedTransactionType, setLastEditedId, setTrophiesList, triggerRefresh }) => {
  // form state
  const amountInputRef = useRef(null);
  const [formData, setFormData] = useState(() => initializeExpenseFormData(editingExpense));

  // state for tracking form submission status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // common expense categories
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

  // Focus on amount input when component mounts
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // create expense object
    const newExpense = {
      ...formData,
      amount: -Math.abs(parseFloat(formData.amount)), // expense number will always be stored as negative
    };

    try {
      let response
      if (editingExpense?.expense_id) {
        // update existing expense
        response = await updateExpense(editingExpense.expense_id, newExpense)

        // Throw error if response fails
        if (!response) throw new Error('Failed to update expense record.')

        // Set edit state to true
        setLastEditedId({ id: editingExpense.expense_id, type: 'Expense' })
        setLastEditedTransactionType('Expense')
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000); // clear success message
        setTimeout(() => setLastEditedId(null), 3500); // clear visual on edited record
        triggerRefresh(); // refresh line graph
      } else {
        // Add new expense
        response = await addExpense(newExpense)

        // Throw error if response fails
        if (!response) throw new Error('Failed to add expense record.')

        // Update trophiesList with any newly earned trophies
        if (response.earnedTrophies?.length) {
          const userId = 1; // hardcoded for now
          const data = await getUserTrophies(userId);
          const filteredData = data.filter(t => t.type === 'badge'); // filter for 'badge' types only
          await setTrophiesList(filteredData);
        }

        // If no errors, show success message
        console.log('Expense added successfully'); // Debugging log
        setSuccess(true);
        triggerRefresh(); // refresh line graph
      }

      // reset the form
      setFormData({
        name: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        category: 'Groceries',
      });

      if (onSubmitSuccess) await onSubmitSuccess(); // Re-fetch expenses

    } catch (error) {
      // Show user-friendly error message
      setError(error.message || 'Failed to add expense');
      // Optionally, log error for debugging
      console.error('Error adding expense', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-expense-form">
      <h2>{editingExpense ? 'Update Expense' : 'Add New Expense'}</h2>

      {/* UI feedback for expense */}
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Expense added successfully!</div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            ref={amountInputRef}
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 12.50"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense_date">Date</label>
          <input
            type="date"
            id="expense_date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label htmlFor="name">Description</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="What was this expense for?"
            required
          />
        </div>

        {/* submit button - add or update expense */}
        {editingExpense
          ? <div>
              <button type="submit" className="submit-btn" disabled={isLoading}>Update Expense</button>
              <button type="submit" className="cancel-btn" disabled={isLoading} onClick={()=> setEditingExpense(null)}>Cancel</button>
            </div>
          : <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Expense'}
            </button>
        }
      </form>
    </div>
  );
};

export default AddExpenseForm;
