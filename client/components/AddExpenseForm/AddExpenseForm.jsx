import React, { useState } from 'react';
import './AddExpenseForm.scss';

const AddExpenseForm = () => {
  // form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0], // set to todays date
    category: 'Groceries',
  });

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
  const handleSubmit = (e) => {
    e.preventDefault();

    // create expense object
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    // log new expense to console
    console.log('New Expense:', newExpense);

    // reset the form
    setFormData({
      description: '',
      amount: '',
      expense_date: new Date().toISOString().split('T')[0],
      category: 'Groceries',
    });
  };

  return (
    <div className="add-expense-form">
      <h2>Add New Expense</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
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




      </form>
    </div>
  );
};

export default AddExpenseForm;
