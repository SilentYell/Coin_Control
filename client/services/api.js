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

// Fetch expense by ID
export const getExpenseById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch expense with ID ${id}`, error);
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

// Fetch income by ID
export const getIncomeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/income/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch income with ID ${id}`, error);
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
    const response = await fetch(`${API_URL}/delete/income/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    console.error(`Failed to delete income with id ${id}:`, error);
    throw error;
  }
};


// fetch all transactions (expense & income)
export const getAllTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/transactions`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch transactions', error);
    throw error;
  }
};


// update transaction by id
export const updateTransaction = async (id, transaction) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update transaction with id ${id}:`, error);
    throw error;
  }
};


// delete an transaction entry
export const deleteTransaction = async (id, type) => {
  try {
    const response = await fetch(`${API_URL}/delete/transactions/${type}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    console.error(`Failed to delete transaction with id ${id}:`, error);
    throw error;
  }
};

// Get trophies for specific user
export const getUserTrophies = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/trophies/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    return;
  } catch (error) {
    console.error(`Failed to retrieve trophies for user id ${userId}`, error);
    throw error;
  }
};