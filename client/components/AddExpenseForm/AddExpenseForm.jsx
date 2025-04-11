import React, { useState } from 'react';
import './AddExpenseForm.scss';

const AddExpenseForm = () => {
  // form state
  const [formData, setFormData] = useState({
    name: '',
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
      name: '',
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* submit button - add expense */}
        <button type="submit" className="submit-btn">Add Expense</button>

      </form>
    </div>
  );
};

export default AddExpenseForm;
