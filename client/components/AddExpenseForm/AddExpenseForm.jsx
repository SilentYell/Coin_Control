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
  };
};

export default AddExpenseForm;
