import React, { useState } from 'react';

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
    <div className="App">
      {!user ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Current Balance: ${user.current_balance.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;