import { useState, useEffect } from 'react';
import '../styles/IncomeForm.scss'
import { addIncomeAndCheckTrophies, updateIncome, getUserBadgeTrophies } from '../services/api';
import { initializeIncomeFormData } from '../src/helpers/initializeFormData';

const IncomeForm = ({ editingIncome, setEditingIncome, onSubmitSuccess, setEditSuccess, setLastEditedTransactionType, setLastEditedId, setTrophiesList }) => {
  // Track current formData
  const [formData, setFormData] = useState(() => initializeIncomeFormData(editingIncome));
  const [success, setSuccess] = useState(false);

  // Render income after submit
  useEffect(() => {
    if (editingIncome && editingIncome) {
      setFormData(initializeIncomeFormData(editingIncome));
    }
  }, [editingIncome]);

  // Common income frequencies
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

        // Throw error if response fails
        if (!response) throw new Error('Failed to update income record.');

        // Set edit state to true
        setLastEditedId({ id: editingIncome.income_id, type: 'Income' })
        setLastEditedTransactionType('Income')
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000); // clear success message
        setTimeout(() => setLastEditedId(null), 3500); // clear visual on edited record
      } else {
        // Add new income
        response = await addIncomeAndCheckTrophies(newIncome);
        // Throw error if response fails
        if (!response) throw new Error('Failed to add income record.');

        // Update trophiesList with any newly earned trophies
        if (response.earnedTrophies?.length) {
          const data = await getUserBadgeTrophies();
          await setTrophiesList(data.allTrophies);
        }

        // Show success message
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }

      // Trigger list update and from reset if the trophy check worked
      if (response) {
        if (onSubmitSuccess) await onSubmitSuccess();
        // Reset the form
        setFormData({
          amount: 0,
          last_payment_date: new Date().toISOString().split('T')[0],
          frequency: 'One-Time',
        });
      }
    } catch (error) {
      console.error('Error adding income:', error.message)
    }
  };

  return (
    <div className="income-form">
      <h2>{editingIncome ? 'Update Income' : 'Add Income'}</h2>

      {/* success message added */}
      {success && <div className="success-message">Income added successfully!</div>}

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

        {/* Conditional Rendering for submit button (Add Income vs Edit Income */}
        {editingIncome
          ? (
          <>
            <button type="submit" className="submit-btn">Update Income</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditingIncome(null)}
            >
              Cancel
            </button>
            </>
          )
          : <button type="submit" className="submit-btn">Add Income</button>
        }

      </form>
    </div>
  );
};

export default IncomeForm;
