import React, { useState, useEffect } from 'react';
import './App.scss';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import useApplicationData from '../hooks/useApplicationData';
import Logo from '../components/Logo';

function App() {
  const {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    editingExpense,
    setEditingExpense,
    editTransactionType,
    setEditTransactionType,
    onSubmitSuccess,
    expensesList,
    setExpensesList,
    fetchExpensesList,
    onExpenseSubmitSuccess,
    editSuccess,
    setEditSuccess,
    lastEditedTransactionType,
    setLastEditedTransactionType,
    lastEditedId,
    setLastEditedId
  } = useApplicationData();

  const [user, setUser] = useState(null);
  const [showLogo, setShowLogo] = useState(false); // don't show logo immediately on load

  useEffect(() => {
    if (!user) {
      setShowLogo(false); // reset on logout
      const timer = setTimeout(() => setShowLogo(true), 650);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const incomeData = await getIncome();
          setIncomeList(incomeData);
          await fetchExpensesList();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, setIncomeList, fetchExpensesList]);

  const handleLogin = () => {
    setUser({
      user_id: 1,
      username: 'Lighthouse Labber',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIncomeList([]);
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
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        editTransactionType={editTransactionType}
        setEditTransactionType={setEditTransactionType}
        onSubmitSuccess={onSubmitSuccess}
        expensesList={expensesList}
        setExpensesList={setExpensesList}
        onExpenseSubmitSuccess={onExpenseSubmitSuccess}
        editSuccess={editSuccess}
        setEditSuccess={setEditSuccess}
        lastEditedTransactionType={lastEditedTransactionType}
        setLastEditedTransactionType={setLastEditedTransactionType}
        lastEditedId={lastEditedId}
        setLastEditedId={setLastEditedId}
      />

      {!user ? (
      <>
        <h3>Please click the login button to view your dashboard.</h3>
        <div className="logo-container" style={{ minHeight: 200 }}>
          {showLogo && (
            <div style={{ animation: 'fadeIn 1s' }}>
              <Logo />
            </div>
          )}
        </div>
      </>
      ) : (
        <Dashboard expenses={expensesList} income={incomeList} />
      )}
    </div>
  );
}

export default App;