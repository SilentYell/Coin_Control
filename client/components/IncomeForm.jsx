import React, { useState } from 'react';
import '../styles/IncomeForm.scss'

const IncomeForm = () => {
  // form state
  const [formData, setFormData] = useState({
    amount: 0,
    last_payment_date: new Date().toISOString().split('T')[0], // set to todays date
    frequency: 'Semi-Monthly',
  });

  // common expense categories
  const frequencies = [
    'Daily',
    'Weekly',
    'Bi-Weekly',
    'Semi-Monthly',
    'Monthly'
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
    const newIncome = {
      ...formData,
      amount: amount.toFixed(2),
    };

    // log new expense to console
    console.log('New Income Record:', newIncome);

    // reset the form
    setFormData({
      amount: null,
      last_payment_date: new Date().toISOString().split('T')[0],
      frequency: 'Semi-Monthly',
    });
  };

  return (
    <div className="income-form">
      <h2>Add New Income</h2>

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="last_payment_date">Paid Date</label>
          <input
            type="date"
            name="last-payment-date"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          >
            {frequencies.map(frequency => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Add Income</button>

      </form>
    </div>
  );
};

export default IncomeForm;
