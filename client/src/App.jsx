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
    editTransaction,
    setEditTransaction,
    onSubmitSuccess,
    expensesList,
    setExpensesList,
    fetchExpensesList,
    onExpenseSubmitSuccess,
  } = useApplicationData();

  const [user, setUser] = useState(null);

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
        editTransaction={editTransaction}
        setEditTransaction={setEditTransaction}
        onSubmitSuccess={onSubmitSuccess}
        expensesList={expensesList}
        setExpensesList={setExpensesList}
        onExpenseSubmitSuccess={onExpenseSubmitSuccess}
      />

      {!user ? (
      <>
        <h3>Please click the login button to view your dashboard.</h3>
        <div className="logo-container">
          <Logo />
        </div>
      </>
      ) : (
        <Dashboard expenses={expensesList} income={incomeList} />
      )}
    </div>
  );
}

export default App;