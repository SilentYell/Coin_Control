import React, { useState } from 'react';
import '../styles/Navbar.scss';

const Navbar = ({ user, handleLogin, handleLogout }) => {

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <span>Coin Control</span>
      </div>

      <ul className='navbar-links'>
        {user ? (
          <>
            <li><a href="#">Expense History</a></li>
            <li><a href="#">Add Expense</a></li>
            <li><a href="#">Income History</a></li>
            <li><a href="#">Add Income</a></li>
            <li><a href="#">Trophy Case</a></li>
          </>
        ) : (
          <></>
        )}
      </ul>

      <div className='navbar-user'>
        {!user ? (
          // If no user, show login button
          <button className='login-btn' onClick={handleLogin}>Login</button>
        ) : (
          <div className='user-info'>
            <span>Welcome, {user.username}</span>
            <span>Balance: ${user.current_balance.toFixed(2)}</span>
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;