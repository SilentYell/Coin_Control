import React, { useState } from 'react';
import { addExpense } from '../../services/api'; // importing api function
import './AddExpenseForm.scss';

const AddExpenseForm = () => {
  // form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0], // set to todays date
    category: 'Groceries',
  });

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

    try {
      // create expense object
      const newExpense = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      // send to api
      const result = await addExpense(newExpense);
      console.log('Expense added:', result);

      // set success state
      setSuccess(true);

      // reset the form
      setFormData({
        name: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        category: 'Groceries',
      });
    } catch (error) {
      setError(error.message || 'Failed to add expense');
      console.error('Error adding expense', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-expense-form">
      <h2>Add New Expense</h2>

      {/* UI feedback for expense */}
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Expense added successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
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

        {/* submit button - add expense */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
