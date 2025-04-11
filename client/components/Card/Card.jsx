import React from 'react';
import './Dashboard.scss';
import { useState } from 'react';

function Dashboard() {
  
  return (
    <div className="dashboard">
      <h1>Card</h1>
      
      <p>Welcome to the Card component!</p>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
      <p>Feel free to customize the content as needed.</p>
    </div>
  );
}

export default Dashboard;