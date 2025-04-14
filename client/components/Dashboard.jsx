import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.scss';
import Card from './Card';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { getExpenses, getIncome } from '../services/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isEditable, setIsEditable] = useState(false); // State to toggle the cards edit mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenses = await getExpenses();
        const income = await getIncome();

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalIncome = income.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);

        setTotalExpenses(totalExpenses);
        setTotalIncome(totalIncome);
        setCurrentBalance(totalIncome - totalExpenses);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // This defines the layout for the grid
  const layout = [
    { i: 'expenses', x: 0, y: 0, w: 2, h: 2 },
    { i: 'income', x: 2, y: 0, w: 2, h: 2 },
    { i: 'balance', x: 4, y: 0, w: 2, h: 2 },
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
          <Card title="Total Expenses" value={`$${Number(totalExpenses || 0).toFixed(2)}`} description="Track your spending here." />
        </div>
        <div key="income">
          <Card title="Total Income" value={`$${Number(totalIncome || 0).toFixed(2)}`} description="Monitor your earnings." />
        </div>
        <div key="balance">
          <Card title="Current Balance" value={`$${Number(currentBalance || 0).toFixed(2)}`} description="Your current financial status." />
        </div>
      </ResponsiveGridLayout>
      </div>
    </div>
  );
}

export default Dashboard;