// API service functions - methods to communicate with backend API

const API_URL = 'http://localhost:3000/api';

// expense API functions

// fetch all expenses
export const getExpenses = async () => {
  try {
    const response = await fetch(`${API_URL}/expenses`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch expenses', error);
    throw error;
  }
};


// add a new expense
export const addExpense = async (expense) => {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw error;
  }
};

// update existing expense
export const updateExpense = async (id, expense) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update expense with id ${id}:`, error);
    throw error;
  }
};

// delete an expense
export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete expense with id ${id}:`, error);
    throw error;
  }
};

// fetch all income entries
export const getIncome = async () => {
  try {
    const response = await fetch(`${API_URL}/income`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch income', error);
    throw error;
  }
};

// add a new income entry
export const addIncome = async (income) => {
  try {
    const response = await fetch(`${API_URL}/income`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(income),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to add income:', error);
    throw error;
  }
};

// update income entry
export const updateIncome = async (id, income) => {
  try {
    const response = await fetch(`${API_URL}/income/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(income),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update income with id ${id}:`, error);
    throw error;
  }
};

// delete an income entry
export const deleteIncome = async (id) => {
  try {
    const response = await fetch(`${API_URL}/income/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete income with id ${id}:`, error);
    throw error;
  }
};