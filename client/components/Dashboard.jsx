import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.scss';
import Card from './Card';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ expenses = [], income = [] }) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [goals, setGoals] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  // Fetch savings goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // Hardcoded user_id 1 for now
        const res = await fetch('http://localhost:3000/api/savings-goals/1');
        const data = await res.json();
        setGoals(data);
        // Calculate total savings
        const savings = data.reduce((sum, goal) => sum + Number(goal.saved || 0), 0);
        setTotalSavings(savings);
      } catch (err) {
        setGoals([]);
        setTotalSavings(0);
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const totalIncome = income.reduce((sum, incomeItem) => sum + Number(incomeItem.amount || 0), 0);
    setTotalExpenses(totalExpenses);
    setTotalIncome(totalIncome);
    setCurrentBalance(totalIncome - totalExpenses - totalSavings);
  }, [expenses, income, totalSavings]);

  const layout = [
    { i: 'expenses', x: 0, y: 0, w: 2, h: 2 },
    { i: 'income', x: 2, y: 0, w: 2, h: 2 },
    { i: 'balance', x: 4, y: 0, w: 2, h: 2 },
    { i: 'savings', x: 0, y: 2, w: 2, h: 2 },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button
        onClick={() => setIsEditable((prev) => !prev)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: isEditable ? '#e53e3e' : '#3182ce',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }}
      >
        {isEditable ? 'Lock Layout' : 'Unlock Layout'}
      </button>
      <div className="dashboard-grid">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          breakpoints={{ lg: 1000, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={70}
          isResizable={isEditable}
          isDraggable={isEditable}
        >
          <div key="expenses">
            <Card
              title="Total Expenses"
              value={`$${Number(totalExpenses || 0).toFixed(2)}`}
              description="Track your spending here."
            />
          </div>
          <div key="income">
            <Card
              title="Total Income"
              value={`$${Number(totalIncome || 0).toFixed(2)}`}
              description="Monitor your earnings."
            />
          </div>
          <div key="balance">
            <Card
              title="Current Balance"
              value={`$${Number(currentBalance || 0).toFixed(2)}`}
              description="Your current financial status (after savings)."
            />
          </div>
          <div key="savings">
            <Card
              title="Total Savings"
              value={`$${Number(totalSavings || 0).toFixed(2)}`}
              description="Total allocated to your savings goals."
            />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}

export default Dashboard;