/**
 * Takes a date string and formats it to a short date, ex. Jan 1, 2025
 * @param {Object} income - the income object to render as a form
 * @returns - the income form data (updated vs new)
 */
export const initializeIncomeFormData = (income) => ({
    amount: income?.amount || '',
    last_payment_date: income?.last_payment_date
      ? new Date(income.last_payment_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    frequency: income?.frequency || 'Semi-Monthly',
});


export const initializeExpenseFormData = (expense) => ({
  name: expense?.name || '',
  amount: expense?.amount || '',
  expense_date: expense?.expense_date
    ? new Date(expense.expense_date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  category: expense?.category || 'Groceries',
});



