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
    'Other'
  ];
};
