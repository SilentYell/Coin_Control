import React, { useState } from 'react';
import './App.scss';
import Navbar from '../components/Navbar';
import IncomeList from '../components/IncomeList';
import ExpensesList from '../components/ExpensesList';
import AddExpenseForm from '../components/AddExpenseForm';
import IncomeForm from '../components/IncomeForm';
import Dashboard from '../components/Dashboard';
import useApplicationData from '../hooks/useApplicationData';

function App() {
  // States and functions from custom hook
  const {
    incomeList,
    setIncomeList,
    getIncome
  } = useApplicationData();

  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Simulate a logged-in user
    setUser({
      user_id: 1,
      username: 'New Boss',
      current_balance: 1000.0,
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <Navbar 
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        incomeList={incomeList}
        setIncomeList={setIncomeList}
        getIncome={getIncome}
      />

      
      {!user ? (

        // If not logged in, show blank dashboard
        <h3>
          Please click the login button to view your dashboard.
        </h3>
      ) : (
        <div>
          <Dashboard />
        </div>
      )}
    </div>
  );
}

export default App;