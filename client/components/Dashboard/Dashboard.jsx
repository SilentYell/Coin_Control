import React from 'react';
import './Dashboard.scss';
import { useState } from 'react';

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState($1200);
  const [totalIncome, setTotalIncome] = useState($2000);
  const [currentBalance, setCurrentBalance] = useState($800);
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
    </div>
  );
}

export default Dashboard;