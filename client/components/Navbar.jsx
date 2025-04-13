import React from 'react';
import '../styles/Navbar.scss';

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <span>Coin Control</span>
      </div>
      <ul>
        <li><a href="#">Expense History</a></li>
        <li><a href="#">Add Expense</a></li>
        <li><a href="#">Income History</a></li>
        <li><a href="#">Add Income</a></li>
        <li><a href="#">Trophy Case</a></li>
      </ul>
      <button className='logout-btn'>Logout</button>
    </nav>
  )
}

export default Navbar;