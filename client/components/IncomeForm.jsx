import React, { useEffect, useState } from 'react';
import '../styles/IncomeForm.scss'
import { addIncome, updateIncome } from '../services/api';
import formatDate from '../src/helpers/formatDate';

const IncomeForm = ({ editingIncome, onSubmitSuccess }) => {
  // Income form state
  const [formData, setFormData] = useState({
    amount: editingIncome?.amount || 0,
    last_payment_date: editingIncome?.last_payment_date
      ? new Date(editingIncome.last_payment_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    frequency: editingIncome?.frequency || 'Semi-Monthly',
  });


  useEffect(() => {
    if (editingIncome) {
      setFormData({
        amount: editingIncome.amount,
        last_payment_date: new Date(editingIncome.last_payment_date).toISOString().split('T')[0],
        frequency: editingIncome.frequency,
      });
    }
  }, [editingIncome?.income_id]);

  // common expense categories
  const frequencies = [
    'One-Time',
    'Daily',
    'Weekly',
    'Bi-Weekly',
    'Semi-Monthly',
    'Monthly'
  ];

  /**
   * Grabs the form data and updates the formData state
   * @param {FormEvent} e - The form change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles form submission for adding a new income entry.
   * Prevents default form behaviour, creates an income object from the form data,
   * sends it to the backend via the API, and resets the form on success.
   *
   * @param {FormEvent} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create income object
    const newIncome = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    // Call income post method in API
    try {
      let response
      if (editingIncome?.income_id) {
        // Update existing income
        response = await updateIncome(editingIncome.income_id, newIncome);
      } else {
        // Add new income
        response = await addIncome(newIncome);
      }

      // Throw error if response fails
      if (!response) throw new Error('Failed to add income record.')

      // Reset the form
      setFormData({
        amount: 0,
        last_payment_date: new Date().toISOString().split('T')[0],
        frequency: 'Semi-Monthly',
      });


      // Notify parent component
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error('Error adding income:', error.message)
    }
  };

  return (
    <div className="income-form">
      <h2>{editingIncome ? 'Update Income' : 'Add Income'}</h2>

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
            name="last_payment_date"
            value={formData.last_payment_date}
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
