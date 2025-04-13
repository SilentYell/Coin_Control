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

  // Need navigation bar to see expense and income lists

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {!user ? (
        <button
          onClick={handleLogin}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      ) : (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Current Balance: ${user.current_balance.toFixed(2)}</p>
          {/* Adding Dashboard Component */}
          <Navbar />
          <Dashboard />


          {/* Adding Expense Form Component */}
          {/* <AddExpenseForm /> */}

          {/* Adding Expenses List Component */}
          {/* <ExpensesList /> */}
        </div>
      )}

      {/* Conditional Rendering for temporary Income list and form buttons */}
      {user && <button
        className="temporary-button"
        onClick={() => {
          getIncome();
          setShowIncome((prev) => !prev)
          }}>
        Show Income History
      </button>}
    {showIncome && <IncomeList incomeList={incomeList} setIncomeList={setIncomeList}/>}
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