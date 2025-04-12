import React, { useState } from 'react';
import './Dashboard.scss';
import Card from '../Card/Card';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(1200);
  const [totalIncome, setTotalIncome] = useState(2000);
  const [currentBalance, setCurrentBalance] = useState(800);
  const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode

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
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={100}
        isResizable={isEditable} // Controlled by isEditable state
        isDraggable={isEditable} // Controlled by isEditable state
      >
        <div key="expenses">
          <Card title="Total Expenses" value={`$${totalExpenses}`} description="Track your spending here." />
        </div>
        <div key="income">
          <Card title="Total Income" value={`$${totalIncome}`} description="Monitor your earnings." />
        </div>
        <div key="balance">
          <Card title="Current Balance" value={`$${currentBalance}`} description="Your current financial status." />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default Dashboard;