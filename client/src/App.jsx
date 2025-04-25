import React, { useState, useEffect } from 'react';
import './App.scss';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import useApplicationData from '../hooks/useApplicationData';
import Logo from '../components/Logo';
import Trophies from '../components/Trophies';

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
    setLastEditedId,
    trophiesList,
    setTrophiesList
  } = useApplicationData();

  const [user, setUser] = useState(null);
  const [showLogo, setShowLogo] = useState(false); // don't show logo immediately on load
  const [goalRefreshTrigger, setGoalRefreshTrigger] = useState(0);
  const [goal, setGoal] = useState(null);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleGoalChanged = () => setGoalRefreshTrigger((prev) => prev + 1);

  // Fetch the latest goal for the user
  const fetchGoal = async (userId) => {
    if (!userId) {
      setGoal(null);
      setTotalSavings(0);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/savings-goals/${userId}`);
      const data = await res.json();
      setGoal(data[0] || null);
      setTotalSavings(data[0]?.saved ? Number(data[0].saved) : 0);
    } catch (e) {
      setGoal(null);
      setTotalSavings(0);
    }
  };

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
  }, [user, setIncomeList, fetchExpensesList, getIncome]);

  useEffect(() => {
    if (user?.user_id) {
      fetchGoal(user.user_id);
    } else {
      setGoal(null);
      setTotalSavings(0);
    }
  }, [user, goalRefreshTrigger]);

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
        setTrophiesList={setTrophiesList}
        onGoalChanged={handleGoalChanged}
        goal={goal}
        totalSavings={totalSavings}
        refreshGoal={() => fetchGoal(user?.user_id)}
      />

      {!user ? (
        <div className="landing-page">
          <div className="hero-section">
            <div className="hero-content">
              <h1>Take Control of Your Finances</h1>
              <p className="hero-subtitle">
                Track expenses, manage income, and achieve your savings goals
                with Coin Control
              </p>
            </div>
            <div className="logo-container">
              {showLogo && (
                <div className="logo-animation">
                  <Logo />
                </div>
              )}
            </div>
          </div>

          <div className="features-section">
            <div className="feature-card">
              <div className="feature-icon expense-icon">💰</div>
              <h3>Expense Tracking</h3>
              <p>Easily track and categorize all your expenses in one place</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon income-icon">📈</div>
              <h3>Income Management</h3>
              <p>Keep track of all your income sources and payment schedules</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon goal-icon">🎯</div>
              <h3>Savings Goals</h3>
              <p>Set savings goals and watch your progress in real-time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon insight-icon">💡</div>
              <h3>AI Insights</h3>
              <p>Get personalized financial insights powered by AI</p>
            </div>
          </div>

          <footer className="landing-footer">
            <p>© 2025 Coin Control | A Personal Finance Management Tool</p>
          </footer>
        </div>
      ) : (
        <>
          <Dashboard
            expenses={expensesList}
            income={incomeList}
            user={user}
            goal={goal}
            totalSavings={totalSavings}
            refreshGoal={() => fetchGoal(user?.user_id)}
          />
          <Trophies trophiesList={trophiesList} setTrophiesList={setTrophiesList}/>
        </>
      )}
    </div>
  );
}

export default App;
