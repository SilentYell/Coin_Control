import React, { useState } from 'react';
import './Dashboard.scss';
import Card from '../Card/Card';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(1200);
  const [totalIncome, setTotalIncome] = useState(2000);
  const [currentBalance, setCurrentBalance] = useState(800);

  // This defines the layout for the grid
  const layout = [
    { i: 'expenses', x: 0, y: 0, w: 2, h: 2 },
    { i: 'income', x: 2, y: 0, w: 2, h: 2 },
    { i: 'balance', x: 4, y: 0, w: 2, h: 2 },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={100}
        isResizable
        isDraggable
      >
        <div key="expenses">
          <Card title="Total Expenses" value={`$${totalExpenses}`} />
        </div>
        <div key="income">
          <Card title="Total Income" value={`$${totalIncome}`} />
        </div>
        <div key="balance">
          <Card title="Current Balance" value={`$${currentBalance}`} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default Dashboard;