import React, { useState } from 'react';
import './App.scss';
import ExpensesList from '../components/ExpensesList/ExpensesList';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Simulate a logged-in user
    setUser({
      user_id: 1,
      username: 'Demo User',
      current_balance: 1000.0,
    });
  };

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
          {/* <AddExpenseForm /> */}


          {/* Adding Expenses List Component */}
          <ExpensesList />
        </div>
      )}
    </div>
  );
}

export default App;