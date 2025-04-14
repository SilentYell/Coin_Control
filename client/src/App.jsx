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

  // Temporary -- don't want to clog up the screen with income and expense data
  const [showIncome, setShowIncome] = useState(false);
  const [incomeForm, setIncomeForm] = useState(false);
  // end of temporary


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

  // Need navigation bar to see expense and income lists

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
        <h3>
          Please click the login button to view your dashboard.
        </h3>
      ) : (
        <div>
          <Dashboard />
        </div>
      )}



      {/* Conditional Rendering for temporary Income list and form buttons */}
      {user && <button
        className="temporary-button"
        onClick={() => {
          getIncome();
          setShowIncome((prev) => !prev);
        }}>
        Show Income History
      </button>}
      {showIncome && <IncomeList incomeList={incomeList} setIncomeList={setIncomeList} />}
      {user && <button
        className="temporary-button"
        onClick={() => setIncomeForm((prev) => !prev)}>
        Add Income
      </button>}
      {incomeForm && <IncomeForm />}
    </div>
  );
}

export default App;