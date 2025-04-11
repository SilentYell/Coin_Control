import React, { useState } from 'react';
import './Dashboard.scss';
import Card from '../Card/Card';

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(1200);
  const [totalIncome, setTotalIncome] = useState(2000);
  const [currentBalance, setCurrentBalance] = useState(800);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <Card title="Total Expenses" value={`$${totalExpenses}`} />
        <Card title="Total Income" value={`$${totalIncome}`} />
        <Card title="Current Balance" value={`$${currentBalance}`} />
      </div>
    </div>
  );
}

export default Dashboard;