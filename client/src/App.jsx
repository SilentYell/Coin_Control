import React, { useState, useEffect } from 'react';
import './App.scss';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import useApplicationData from '../hooks/useApplicationData';
import { getExpenses } from '../services/api';
import Modal from '../components/Modal';
import ExpensesList from '../components/ExpensesList';

function App() {
  const {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    onSubmitSuccess,
  } = useApplicationData();

  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]); // Track expenses state
  const [showExpenseListModal, setShowExpenseListModal] = useState(false); // Track modal state

  // Fetch expenses and income after login
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const expensesData = await getExpenses();
          const incomeData = await getIncome();

          setExpenses(expensesData);
          setIncomeList(incomeData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, setIncomeList]);

  const handleLogin = () => {
    // Simulate a logged-in user
    setUser({
      user_id: 1,
      username: 'Lighthouse Labber',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]); // Clear expenses on logout
    setIncomeList([]); // Clear income on logout
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
        editingIncome={editingIncome}
        setEditingIncome={setEditingIncome}
        onSubmitSuccess={onSubmitSuccess}
      />

      {!user ? (
        <h3>Please click the login button to view your dashboard.</h3>
      ) : (
        <>
          <Dashboard expenses={expenses} income={incomeList} />
          <Modal isOpen={showExpenseListModal} onClose={() => setShowExpenseListModal(false)}>
            <ExpensesList setExpenses={setExpenses} />
          </Modal>
        </>
      )}
    </div>
  );
}

export default App;