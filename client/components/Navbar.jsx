import React, { useState } from 'react';
import '../styles/Navbar.scss';
import '../styles/SavingsGoalModal.scss';
import Modal from './Modal';
import IncomeForm from './IncomeForm';
import AddExpenseForm from './AddExpenseForm';
import ExpensesList from './ExpensesList';
import IncomeList from './IncomeList';
import TrophyCase from './TrophyCase';
import NavbarLogo from './NavbarLogo'
import { FaBars, FaTimes } from 'react-icons/fa';
import AllTransactions from './AllTransactions';
import { getUserBadgeTrophies } from '../services/api';

const API_URL = 'http://localhost:3000/api';

const Navbar = (
  { user,
    handleLogin,
    handleLogout,
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    editingExpense,
    setEditingExpense,
    editTransactionType,
    setEditTransactionType,
    onSubmitSuccess,
    expensesList,
    setExpensesList,
    fetchExpensesList,
    onExpenseSubmitSuccess,
    editSuccess,
    setEditSuccess,
    lastEditedTransactionType,
    setLastEditedTransactionType,
    lastEditedId,
    setLastEditedId,
    setTrophiesList,
    goal,
    totalSavings,
    refreshGoal
  }) => {

  const [showIncomeFormModal, setShowIncomeFormModal] = useState(false);
  const [showExpenseFormModal, setShowExpenseFormModal] = useState(false);
  const [showIncomeListModal, setShowIncomeListModal] = useState(false);
  const [showExpenseListModal, setShowExpenseListModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTrophyCaseModal, setShowTrophyCaseModal] = useState(false);
  const [goalPercent, setGoalPercent] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editPercent, setEditPercent] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editName, setEditName] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getProgress = (goal) => {
    if (!goal.amount || !goal.saved) return 0;
    return Math.min((goal.saved / goal.amount) * 100, 100);
  };

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>
          <NavbarLogo size="small" />
          <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '18px' }}>
          </span>
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
                  const handleIncomeHistoryClick = async () => {
                    if (!incomeList || incomeList.length === 0) {
                      const updatedList = await getIncome();
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
              <li><button onClick={() => setShowTransactionsModal(true)}>All Transactions</button></li>
              <li><button onClick={() => setShowTrophyCaseModal(true)}>Trophy Case</button></li>
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
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            editSuccess={editSuccess}
            setEditSuccess={setEditSuccess}
            lastEditedId={lastEditedId}
            setLastEditedId={setLastEditedId}
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
            editSuccess={editSuccess}
            setEditSuccess={setEditSuccess}
            lastEditedId={lastEditedId}
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
            setEditingIncome={setEditingIncome}
            setEditSuccess={setEditSuccess}
            setLastEditedId={setLastEditedId}
            setLastEditedTransactionType={setLastEditedTransactionType}
            setTrophiesList={setTrophiesList}
            onSubmitSuccess={async () => {
              await onSubmitSuccess();
              setEditingIncome(undefined);
            }}
            onClose={() => setShowIncomeFormModal(false)}
          />
        </Modal>
      )}

      {(showTransactionsModal || editTransactionType) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setEditTransactionType(undefined);
            setEditingIncome(undefined);
            setEditingExpense(undefined);
            setShowTransactionsModal(false);
          }}
        >
          {editTransactionType === 'Income' && editingIncome ? (
              <IncomeForm
                editingIncome={editingIncome}
                setEditingIncome={setEditingIncome}
                setEditSuccess={setEditSuccess}
                setLastEditedId={setLastEditedId}
                setLastEditedTransactionType={setLastEditedTransactionType}
                onSubmitSuccess={async () => {
                  await onSubmitSuccess();
                  setEditingIncome(undefined);
                  setEditTransactionType(undefined);
                }}
                onClose={() => {
                  setEditingIncome(undefined);
                  setEditTransactionType(undefined)
                }}
              />
            ) : editTransactionType === 'Income' ? (
              <div>Loading income record...</div>
            ) : editTransactionType === 'Expense' && editingExpense ? (
              <AddExpenseForm
                editingExpense={editingExpense}
                setEditSuccess={setEditSuccess}
                setLastEditedId={setLastEditedId}
                setTrophiesList={setTrophiesList}
                setLastEditedTransactionType={setLastEditedTransactionType}
                onSubmitSuccess={ async () => {
                  await onExpenseSubmitSuccess();
                  setEditingExpense(undefined);
                  setEditTransactionType(undefined);
                }}
                onClose={() => {
                  setEditingExpense(undefined);
                  setEditTransactionType(undefined);
                }}
              />
          ) : (
            <AllTransactions
              onEditIncome={setEditingIncome}
              onEditExpense={setEditingExpense}
              editTransactionType={setEditTransactionType}
              setEditTransactionType={setEditTransactionType}
              lastEditedTransactionType={lastEditedTransactionType}
              lastEditedId={lastEditedId}
              setShowTransactionsModal={setShowTransactionsModal}
              editSuccess={editSuccess}
              onSubmitSuccess={async () => {
                await onSubmitSuccess();
                setEditTransactionType(undefined);
              }}
              onExpenseSubmitSuccess={async () => {
                await onExpenseSubmitSuccess();
                setEditTransactionType(undefined);
              }}
              onClose={() => setShowTransactionsModal(false)}
            />
          )}
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
                if (refreshGoal) refreshGoal();
              }}
            >
              <div className="modal-header">
                <h2>Edit Savings Goal</h2>
              </div>
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
                % of Future Income to Save:
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
                if (data.earnedTrophies?.length > 0) {
                  const updatedTrophies = await getUserBadgeTrophies(user.user_id);
                  setTrophiesList(updatedTrophies.allTrophies);
                }

                setGoalName('');
                setGoalAmount('');
                setGoalPercent('');
                if (refreshGoal) refreshGoal();
              }}
            >
              <div className="modal-header">
                <h2>Savings Goal</h2>
              </div>
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
          <div className="savings-goals-list">
            <h3>Your Savings Goals</h3>
            {(!goal) && <div>No goals yet.</div>}
            {goal && (
              <div key={goal.goal_id} className={`goal-item ${getProgress(goal) >= 100 ? 'completed-goal' : ''}`}>
                <div className="goal-title">{goal.name} (${goal.amount})</div>
                <div className="goal-percent">Saving {goal.percent}% of future income</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getProgress(goal)}%` }}></div>
                </div>
                <div className="goal-saved">
                  <span className="current-amount">${Number(goal.saved || 0).toFixed(2)}</span>
                  <span> / </span>
                  <span className="target-amount">${Number(goal.amount).toFixed(2)}</span>
                </div>
                <div className="goal-actions">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setEditName(goal.name);
                      setEditAmount(goal.amount);
                      setEditPercent(goal.percent);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-goal"
                    onClick={async () => {
                      try {
                        await fetch(`${API_URL}/savings-goals/${goal.goal_id}`, {
                          method: 'DELETE',
                        });
                        if (refreshGoal) refreshGoal();
                      } catch (error) {
                        console.error('Error deleting goal:', error);
                        alert('Failed to delete goal. Please try again.');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {showTrophyCaseModal && (
        <Modal isOpen={showTrophyCaseModal} onClose={() => setShowTrophyCaseModal(false)}>
          <TrophyCase userId={user.user_id} />
        </Modal>
      )}
    </>
  );
};

export default Navbar;