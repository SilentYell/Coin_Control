import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Dashboard.scss';
import Card from './Card';
import GoalCard from './GoalCard';
import ExpensesPieChart from './ExpensesPieChart';
import AIInsights from './AIInsights';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaLightbulb, FaLock, FaLockOpen } from 'react-icons/fa';
import Modal from './Modal';

const ResponsiveGridLayout = WidthProvider(Responsive);

const compactLayout = [
  { i: 'goal', x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'expenses', x: 0, y: 2, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'income', x: 0, y: 4, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'balance', x: 0, y: 6, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'savings', x: 0, y: 8, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'ai-insights', x: 0, y: 10, w: 6, h: 4.5, minW: 2, minH: 6 },
  { i: 'pie-chart', x: 0, y: 15, w: 6, h: 6, minW: 2, minH: 2 },
];
const wideLayout = [
  { i: 'goal', x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'expenses', x: 2, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'income', x: 4, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'balance', x: 0, y: 2, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'savings', x: 2, y: 2, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'ai-insights', x: 4, y: 2, w: 2, h: 8, minW: 1, minH: 6 },
  { i: 'pie-chart', x: 0, y: 4, w: 4, h: 6, minW: 2, minH: 2 },
];

function getInitialLayout() {
  const saved = localStorage.getItem('dashboardLayout');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return wideLayout;
    }
  }
  return wideLayout;
}

function Dashboard({ expenses = [], income = [], goalRefreshTrigger, onLogout }) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [goal, setGoal] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showFinancialInsights, setShowFinancialInsights] = useState(false);

  const [layoutState, setLayoutState] = useState(getInitialLayout);

  // Helper to get the width of the goal card in grid columns
  const goalCardWidth = layoutState.find((l) => l.i === 'goal')?.w || 6;
  const isGoalCardCompact = goalCardWidth < 3;

  // Helper to fetch the latest goal
  const fetchGoal = useCallback(async () => {
    try {
      // Hardcoded user_id 1 for now
      const res = await fetch('http://localhost:3000/api/savings-goals/1');
      const data = await res.json();
      // Only one goal per user, so take the first
      setGoal(data[0] || null);
      setTotalSavings(data[0]?.saved ? Number(data[0].saved) : 0);
    } catch {
      setGoal(null);
      setTotalSavings(0);
    }
  }, []);

  // Remove goal from dashboard state when completed
  const handleGoalComplete = () => {
    setGoal(null);
    setTotalSavings(0);
  };

  // Helper to format currency with commas and 2 decimals
  function formatCurrency(amount) {
    return (amount < 0 ? '-' : '') + '$' + Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Fetch goal on mount and whenever income/expenses or goal changes
  useEffect(() => {
    fetchGoal();
  }, [fetchGoal, income, expenses, goalRefreshTrigger]);

  useEffect(() => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );
    const totalIncome = income.reduce(
      (sum, incomeItem) => sum + Number(incomeItem.amount || 0),
      0
    );
    setTotalExpenses(totalExpenses);
    setTotalIncome(totalIncome);
    setCurrentBalance(totalIncome + totalExpenses - totalSavings);
  }, [expenses, income, totalSavings, goal]);

  useEffect(() => {
    if (typeof onLogout === 'function') {
      onLogout(() => {
        localStorage.removeItem('dashboardLayout');
      });
    }
  }, [onLogout]);

  // Save only the layout array (not a preset name)
  const handleSaveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layoutState));
  };

  // Update layoutState on drag/resize stop
  const handleLayoutChange = (newLayout) => {
    setLayoutState(newLayout);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-controls">
        <button
          onClick={() => setIsEditable((prev) => !prev)}
          className={`shine-btn${isEditable ? ' unlocked' : ''}`}
          title={isEditable ? 'Lock Layout' : 'Unlock Layout'}
        >
          {isEditable ? <FaLockOpen /> : <FaLock />}
        </button>
        <button
          onClick={() => setLayoutState(compactLayout)}
          className="shine-btn"
        >
          Compact
        </button>
        <button
          onClick={() => setLayoutState(wideLayout)}
          className="shine-btn"
        >
          Wide
        </button>
        <button
          onClick={handleSaveLayout}
          className="shine-btn"
        >
          Save Layout
        </button>
      </div>
      <div className="dashboard-grid">
        <ResponsiveGridLayout
          className="layout"
          layouts={{
            lg: layoutState,
            md: layoutState,
            sm: layoutState,
            xs: layoutState,
            xxs: layoutState,
          }}
          breakpoints={{ lg: 1000, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={70}
          isResizable={isEditable}
          isDraggable={isEditable}
          onResizeStop={handleLayoutChange}
          onDragStop={handleLayoutChange}
          preventCollision={false}
          compactType={'vertical'}
          margin={[16, 16]}
          containerPadding={[16, 16]}
          resizeHandles={['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']}
        >
          <div key="goal">
            <GoalCard
              goal={goal}
              saved={totalSavings}
              compact={isGoalCardCompact}
              onGoalComplete={handleGoalComplete}
            />
          </div>
          <div key="expenses">
            <Card
              title="Total Expenses"
              value={formatCurrency(totalExpenses || 0)}
              description="Track your spending here."
              valueClassName="card-value--expenses"
            />
          </div>
          <div key="income">
            <Card
              title="Total Income"
              value={formatCurrency(totalIncome || 0)}
              description="Monitor your earnings."
            />
          </div>
          <div key="balance">
            <Card
              title="Current Balance"
              value={formatCurrency(currentBalance || 0)}
              description="Your current financial status (after savings)."
              valueClassName={currentBalance >= 0 ? "card-value--positive" : "card-value--negative"}
            />
          </div>
          <div key="savings">
            <Card
              title="Total Savings"
              value={formatCurrency(totalSavings || 0)}
              description="Total allocated to your savings goals."
              valueClassName="card-value--savings"
            />
          </div>
          <div key="ai-insights">
            <Card title="Financial Insights">
              <AIInsights
                expenses={expenses}
                income={income}
                preview={true}
                maxPreviewLines={5}
                onViewFullInsights={() => setShowFinancialInsights(true)}
              />
            </Card>
          </div>
          <div key="pie-chart">
            <Card title="Expenses Breakdown">
              <ExpensesPieChart />
            </Card>
          </div>
        </ResponsiveGridLayout>
      </div>
      {showFinancialInsights && (
        <Modal
          isOpen={showFinancialInsights}
          onClose={() => setShowFinancialInsights(false)}
        >
          <div className="financial-insights">
            <h2>
              <FaLightbulb /> Financial Insights
            </h2>
            <div className="financial-insights-content">
              <AIInsights expenses={expenses} income={income} preview={false} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
