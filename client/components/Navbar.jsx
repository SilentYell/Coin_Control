import React, { useState } from 'react';
import '../styles/Navbar.scss';
import Modal from './Modal';
import IncomeForm from './IncomeForm';
import AddExpenseForm from './AddExpenseForm';
import ExpensesList from './ExpensesList';
import IncomeList from './IncomeList';
import useApplicationData from '../hooks/useApplicationData';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ user, handleLogin, handleLogout, incomeList, setIncomeList, getIncome, editingIncome, setEditingIncome, onSubmitSuccess }) => {
  const { expensesList, setExpensesList, fetchExpensesList, onExpenseSubmitSuccess } = useApplicationData();

  const [showIncomeFormModal, setShowIncomeFormModal] = useState(false);
  const [showExpenseFormModal, setShowExpenseFormModal] = useState(false);
  const [showIncomeListModal, setShowIncomeListModal] = useState(false);
  const [showExpenseListModal, setShowExpenseListModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>
          <span>Coin Control</span>
        </div>
        {menuOpen ? (
          <FaTimes className="hamburger" onClick={toggleMenu} />
        ) : (
          <FaBars className="hamburger" onClick={toggleMenu} />
        )}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>

          {user ? (

            // If logged in, show buttons
            <>
              <li><button onClick={() => setShowExpenseListModal(true)}>Expense History</button></li>
              <li><button onClick={() => setShowExpenseFormModal(true)}>Add Expense</button></li>
              <li>
                <button onClick={async () => {
                  //ph change - dont fetch every time, only if needed
                  if (!incomeList || incomeList.length === 0) {
                    getIncome().then(updatedList => {
                      console.log("Updated Income List:", updatedList); // Debugging line (moved inside promise - ph)
                      setIncomeList(updatedList);
                    });
                  }
                  setShowIncomeListModal(true);
                }}>
                  Income History
                </button>
              </li>
              <li><button onClick={() => setShowIncomeFormModal(true)}>Add Income</button></li>
              <li><button>Trophy Case</button></li>
            </>
          ) : (
            // If not logged in, Navbar is empty
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
              <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {showExpenseListModal && (
        <Modal isOpen={showExpenseListModal} onClose={() => setShowExpenseListModal(false)}>
          <ExpensesList
            expensesList={expensesList}
            setExpensesList={setExpensesList}
            onSubmitSuccess={onExpenseSubmitSuccess}
          />
        </Modal>
      )}

      {showExpenseFormModal && (
        <Modal isOpen={showExpenseFormModal} onClose={() => setShowExpenseFormModal(false)}>
          <AddExpenseForm onSubmitSuccess={onExpenseSubmitSuccess} />
        </Modal>
      )}

      {showIncomeListModal && (
        <Modal isOpen={showIncomeListModal} onClose={() => setShowIncomeListModal(false)}>
          <IncomeList
            incomeList={incomeList}
            setIncomeList={setIncomeList}
            editingIncome={editingIncome}
            setEditingIncome={setEditingIncome}
          />
        </Modal>
      )}

      {(showIncomeFormModal || editingIncome) && (
        <Modal isOpen={true} onClose={() => {
          setEditingIncome(undefined);
          setShowIncomeFormModal(false);
        }}>
          <IncomeForm 
            editingIncome={editingIncome}
            onSubmitSuccess={async () => {
              onSubmitSuccess();
              setEditingIncome(undefined);
              setShowIncomeFormModal(false);
              // ph change - causes additional fetch ( the two lines below this were removed)
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Navbar;