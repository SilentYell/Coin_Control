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
