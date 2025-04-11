import React from 'react';
import './Card.scss';

function Card({ title, value }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}

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