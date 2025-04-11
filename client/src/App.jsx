import React, { useState } from 'react';
import './App.scss';
import IncomeList from '../components/IncomeList';
import ExpensesList from '../components/ExpensesList/ExpensesList';
import AddExpenseForm from '../components/AddExpenseForm/AddExpenseForm';
import IncomeForm from '../components/IncomeForm';


function App() {

  const [user, setUser] = useState(null);

  // Temporary -- don't want to clog up the screen with income and expense data
  const [showIncome, setShowIncome] = useState(false);
  const [incomeForm, setIncomeForm] = useState(false);
  // end of temporary


  const handleLogin = () => {
    // Simulate a logged-in user
    setUser({
      user_id: 1,
      username: 'Demo User',
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

          {/* Adding Epense Form Component */}
          <AddExpenseForm />


          {/* Adding Expenses List Component */}
          <ExpensesList />
        </div>
      )}

      {/* Conditional Rendering for temporary Income list and form buttons */}
      {user && <button
      className="temporary-button"
      onClick={() => setShowIncome((prev) => !prev)}>
        Show Income History

      </button>}
      {showIncome && <IncomeList />}
      {user && <button
      className="temporary-button"
      onClick={() => setIncomeForm((prev) => !prev)}>
        Add Income
      </button> }
      {incomeForm && <IncomeForm />}
    </div>
  );
}

export default App;