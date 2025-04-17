import React, { useState, useEffect } from 'react';
import '../styles/Navbar.scss';
import '../styles/SavingsGoalModal.scss';
import Modal from './Modal';
import IncomeForm from './IncomeForm';
import AddExpenseForm from './AddExpenseForm';
import ExpensesList from './ExpensesList';
import IncomeList from './IncomeList';
import useApplicationData from '../hooks/useApplicationData';
import { FaBars, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:3000/api';

const Navbar = ({ user, handleLogin, handleLogout, incomeList, setIncomeList, getIncome, editingIncome, setEditingIncome, onSubmitSuccess, expensesList, setExpensesList, fetchExpensesList, onExpenseSubmitSuccess }) => {

  const [showIncomeFormModal, setShowIncomeFormModal] = useState(false);
  const [showExpenseFormModal, setShowExpenseFormModal] = useState(false);
  const [showIncomeListModal, setShowIncomeListModal] = useState(false);
  const [showExpenseListModal, setShowExpenseListModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalPercent, setGoalPercent] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goals, setGoals] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editPercent, setEditPercent] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editName, setEditName] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (showGoalModal && user) {
      fetch(`${API_URL}/savings-goals/${user.user_id}`)
        .then(res => res.json())
        .then(data => setGoals(data))
        .catch(() => setGoals([]));
    }
  }, [showGoalModal, user]);

  const getProgress = (goal) => {
    if (!goal.amount || !goal.saved) return 0;
    return Math.min((goal.saved / goal.amount) * 100, 100);
  };

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>
          <span>Coin Control</span>
        </div>
        {user && (
          menuOpen ? (
            <FaTimes className="hamburger" onClick={toggleMenu} />
          ) : (
            <FaBars className="hamburger" onClick={toggleMenu} />
          )
        )}

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            // If logged in, show buttons
            <>
              <li><button onClick={() => setShowExpenseListModal(true)}>Expense History</button></li>
              <li><button onClick={() => setShowExpenseFormModal(true)}>Add Expense</button></li>
              <li><button onClick={() => setShowGoalModal(true)}>Savings Goal</button></li>
              <li>
                <button onClick={() => {
                  //ph change - dont fetch every time, only if needed
                  const handleIncomeHistoryClick = async () => {
                    if (!incomeList || incomeList.length === 0) {
                      const updatedList = await getIncome();
                      console.log("Updated Income List:", updatedList);
                      setIncomeList(updatedList);
                    }
                    setShowIncomeListModal(true);
                  };
                  handleIncomeHistoryClick();
                }}>
                  Income History
                </button>
              </li>
              <li><button onClick={() => setShowIncomeFormModal(true)}>Add Income</button></li>
              <li><button>Trophy Case</button></li>
              {user && (
                <li className="mobile-logout">
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </li>
              )}
            </>
          ) : (
            <></>
          )}
        </ul>
        <div className='navbar-user'>
          {!user ? (
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
            }}
            onClose={() => setShowIncomeFormModal(false)}
          />
        </Modal>
      )}

      {showGoalModal && (
        <Modal isOpen={showGoalModal} onClose={() => { setShowGoalModal(false); setEditingGoal(null); }}>
          {editingGoal ? (
            <form
              className="savings-goal-modal"
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  name: editName,
                  amount: parseFloat(editAmount),
                  percent: parseFloat(editPercent),
                  saved: editingGoal.saved
                };
                await fetch(`${API_URL}/savings-goals/${editingGoal.goal_id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                setEditingGoal(null);
                setEditName('');
                setEditAmount('');
                setEditPercent('');
                // Refresh goals
                fetch(`${API_URL}/savings-goals/${user.user_id}`)
                  .then(res => res.json())
                  .then(data => setGoals(data));
              }}
            >
              <label>
                Goal Name:
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </label>
              <label>
                Goal Amount ($):
                <input
                  type="number"
                  min="1"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  required
                />
              </label>
              <label>
                % of future income to save:
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editPercent}
                  onChange={e => setEditPercent(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Update Goal</button>
              <button type="button" onClick={() => setEditingGoal(null)} style={{marginTop:8}}>Cancel</button>
            </form>
          ) : (
            <form
              className="savings-goal-modal"
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  user_id: user.user_id,
                  name: goalName,
                  amount: parseFloat(goalAmount),
                  percent: parseFloat(goalPercent)
                };
                const res = await fetch(`${API_URL}/savings-goals`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                setGoalName('');
                setGoalAmount('');
                setGoalPercent('');
                fetch(`${API_URL}/savings-goals/${user.user_id}`)
                  .then(res => res.json())
                  .then(data => setGoals(data));
              }}
            >
              <label>
                Goal Name:
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  required
                />
              </label>
              <label>
                Goal Amount ($):
                <input
                  type="number"
                  min="1"
                  value={goalAmount}
                  onChange={e => setGoalAmount(e.target.value)}
                  required
                />
              </label>
              <label>
                % of future income to save:
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={goalPercent}
                  onChange={e => setGoalPercent(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save Goal</button>
            </form>
          )}
          <div style={{ marginTop: '2rem' }}>
            <h3>Your Savings Goals</h3>
            {goals.length === 0 && <div>No goals yet.</div>}
            {goals.map(goal => (
              <div key={goal.goal_id} style={{ marginBottom: '1.5rem', background: '#fcedd3', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{goal.name} (${goal.amount})</div>
                <div style={{ fontSize: 14, color: '#876510' }}>Saving {goal.percent}% of future income</div>
                <div style={{ background: '#eee', borderRadius: 8, height: 16, margin: '8px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${getProgress(goal)}%`, background: '#FFD700', height: 16, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 13 }}>
                  Saved: ${Number(goal.saved || 0).toFixed(2)} / ${Number(goal.amount).toFixed(2)}
                </div>
                <button style={{marginTop:8}} onClick={() => {
                  setEditingGoal(goal);
                  setEditName(goal.name);
                  setEditAmount(goal.amount);
                  setEditPercent(goal.percent);
                }}>Edit</button>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbar;