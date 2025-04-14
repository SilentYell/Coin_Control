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
    getIncome,
    editingIncome,
    setEditingIncome,
    onSubmitSuccess,
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

      {/* Conditional Rendering for temporary Income list and form buttons */}
      {user && <button
        className="temporary-button"
        onClick={async () => {
          const updatedList = await getIncome();
          setIncomeList(updatedList);
          setShowIncome((prev) => !prev)
          }}>
        Show Income History
      </button>}
      {showIncome &&
        <IncomeList
          incomeList={incomeList}
          setIncomeList={setIncomeList}
          editingIncome={editingIncome}
          setEditingIncome={setEditingIncome}
        />
      }

      {/* Show editing form and past edit data */}
      {editingIncome && (
        <IncomeForm
          editingIncome={editingIncome}
          onSubmitSuccess={async () => {
            setEditingIncome(undefined); // hide form after submission
            const updatedList = await getIncome();
            setIncomeList(updatedList);
          }}
        />
      )}

      {/* Currently it's own button but maybe we move this to the 'income page' (i.e, hide other content only show income related stuff)? */}
      {user && <button
        className="temporary-button"
        onClick={() => setIncomeForm((prev) => !prev)}>
        Add Income
      </button>}
      {incomeForm && (
        <IncomeForm
          onSubmitSuccess={async () => {
            onSubmitSuccess()
          }}
        />
      )}
    </div>
  );
}

export default App;