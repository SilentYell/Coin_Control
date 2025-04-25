import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Dashboard.scss';
import Card from './Card';
import GoalCard from './GoalCard';
import ExpensesPieChart from './ExpensesPieChart';
import AIInsights from './AIInsights';
import Modal from './Modal';
import TrophyPopup from './TrophyPopup';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaLightbulb, FaLock, FaLockOpen, FaRegSave } from 'react-icons/fa';
import { getUserTrophies } from '../services/api';
import ToggleLayoutButton from './ToggleLayoutButton';
import anime from 'animejs/lib/anime.es.js';
import TrophyPhysicsCard from './TrophyPhysicsCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const compactLayout = [
  { i: 'goal', x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'balance', x: 0, y: 3, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'expenses', x: 2, y: 3, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'income', x: 0, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'savings', x: 2, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'ai-insights', x: 0, y: 2, w: 2, h: 5, minW: 2, minH: 4 },
  { i: 'pie-chart', x: 2, y: 2, w: 2, h: 5, minW: 2, minH: 5 },
  { i: 'trophy-physics', x: 6, y: 21, w: 2, h: 9, minW: 3, minH: 3 },
];
const wideLayout = [
  { i: 'goal', x: 0, y: 1, w: 6, h: 2, minW: 2, minH: 2 },
  { i: 'expenses', x: 2, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'income', x: 0, y: 3, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'balance', x: 0, y: 3, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'savings', x: 2, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
  { i: 'ai-insights', x: 0, y: 2, w: 6, h: 6, minW: 1, minH: 4 },
  { i: 'pie-chart', x: 0, y: 4, w: 4, h: 6, minW: 2, minH: 5 },
  { i: 'trophy-physics', x: 6, y: 4, w: 2, h: 10, minW: 3, minH: 3 },
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

function Dashboard({ expenses = [], income = [], user, goal, totalSavings, refreshGoal, trophiesList = [], onLogout, ...rest }) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [showFinancialInsights, setShowFinancialInsights] = useState(false);
  const [newTrophy, setNewTrophy] = useState(null);

  const [layoutState, setLayoutState] = useState(getInitialLayout);
  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = localStorage.getItem('dashboardLayoutMode');
    if (saved === 'compact' || saved === 'wide') return saved;
    return 'wide';
  });

  useEffect(() => {
    if (layoutMode === 'compact') {
      setLayoutState(compactLayout);
    } else {
      setLayoutState(wideLayout);
    }
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem('dashboardLayoutMode', layoutMode);
  }, [layoutMode]);

  // Helper to get the width of the goal card in grid columns
  const goalCardWidth = layoutState.find((l) => l.i === 'goal')?.w || 6;
  const isGoalCardCompact = goalCardWidth < 3;

  // Remove goal from dashboard state when completed
  const handleGoalComplete = async (goalId) => {
    if (!goalId) return;
    try {
      await fetch(`http://localhost:3000/api/savings-goals/${goalId}`, {
        method: 'DELETE',
      });
      if (refreshGoal) refreshGoal();
    } catch (err) {
      console.error('Failed to delete goal on completion:', err);
      if (refreshGoal) refreshGoal(); // fallback to refresh
    }
  };

  // Fetch the trophies whenever income/expenses or savings update
  const fetchTrophies = useCallback(async () => {
    try {
      const trophies = await getUserTrophies(user.user_id);
      // Only set new trophy popup if there are new trophies
      setNewTrophy((prev) => {
        const previousIds = new Set((prev?.map?.(t => t.trophy_id)) || []);
        const newTrophies = trophies.filter(t => !previousIds.has(t.trophy_id));
        if (newTrophies.length > 0) {
          const mostRecentTrophy = newTrophies.sort((a, b) => b.trophy_id - a.trophy_id)[0];
          setTimeout(() => setNewTrophy(null), 4000);
          return mostRecentTrophy;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching trophies: ', error);
    }
  }, [user.user_id]);

  // Helper to format currency with commas and 2 decimals
  function formatCurrency(amount) {
    return (amount < 0 ? '-' : '') + '$' + Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Fetch trophies on mount and whenever income/expenses or user changes
  useEffect(() => {
    fetchTrophies();
  }, [income, expenses, fetchTrophies, user]);

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
  }, [expenses, income, totalSavings]);

  useEffect(() => {
    if (typeof onLogout === 'function') {
      onLogout(() => {
        localStorage.removeItem('dashboardLayout');
      });
    }
  }, [onLogout]);

  // Track previous trophy card position
  const [trophyCardPos, setTrophyCardPos] = useState(() => {
    const item = getInitialLayout().find(l => l.i === 'trophy-physics');
    return item ? { x: item.x, y: item.y } : { x: 0, y: 0 };
  });

  // Save only the layout array (not a preset name)
  const handleSaveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layoutState));
    anime({
      targets: '.save-layout-btn',
      scale: [1, 1.15, 1],
      duration: 400,
      easing: 'easeInOutQuad',
    });
  };

  // Update layoutState on drag/resize stop and track trophy card position
  const handleLayoutChange = (newLayout) => {
    setLayoutState(
      newLayout.map(item => {
        if (item.i === 'pie-chart') {
          return { ...item, minH: 4 };
        }
        return item;
      })
    );
    // Find trophy card and update position
    const trophyItem = newLayout.find(l => l.i === 'trophy-physics');
    if (trophyItem) {
      setTrophyCardPos({ x: trophyItem.x, y: trophyItem.y });
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-controls">
        {/* Lock/Unlock Switch */}
        <div
          className={`lock-switch${isEditable ? ' unlocked' : ''}`}
          onClick={() => setIsEditable((prev) => !prev)}
          title={isEditable ? 'Unlocked: Drag/resize enabled' : 'Locked: Layout fixed'}
          role="button"
          tabIndex={0}
          aria-pressed={isEditable}
        >
          {isEditable ? (
            <>
              <span className="switch-icon unlock"><FaLockOpen /></span>
              <span className="switch-circle" />
            </>
          ) : (
            <>
              <span className="switch-icon lock"><FaLock /></span>
              <span className="switch-circle" />
            </>
          )}
        </div>
        <ToggleLayoutButton
          isCompact={layoutMode === 'compact'}
          onToggle={() => setLayoutMode(layoutMode === 'compact' ? 'wide' : 'compact')}
        />
        <button
          onClick={handleSaveLayout}
          className={`shine-btn save-layout-btn`}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          aria-label="Save Layout"
        >
          <FaRegSave style={{ fontSize: 18 }} />
          <span>Save Layout</span>
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
              isEditable={isEditable}
            />
          </div>
          <div key="expenses">
            <Card
              title="Total Expenses"
              value={formatCurrency(totalExpenses || 0)}
              description="Track your spending here."
              valueClassName="card-value--expenses"
              isEditable={isEditable}
              animateValue={true}
            />
          </div>
          <div key="income">
            <Card
              title="Total Income"
              value={formatCurrency(totalIncome || 0)}
              description="Monitor your earnings."
              isEditable={isEditable}
              animateValue={true}
            />
          </div>
          <div key="balance">
            <Card
              title="Current Balance"
              value={formatCurrency(currentBalance || 0)}
              description="Your current financial status (after savings)."
              valueClassName={currentBalance >= 0 ? "card-value--positive" : "card-value--negative"}
              isEditable={isEditable}
              animateValue={true}
            />
          </div>
          <div key="savings">
            <Card
              title="Total Savings"
              value={formatCurrency(totalSavings || 0)}
              description="Total allocated to your savings goals."
              valueClassName="card-value--savings"
              isEditable={isEditable}
              animateValue={true}
            />
          </div>
          <div key="ai-insights">
            <Card title="Financial Insights" isEditable={isEditable}>
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
            <Card title="Expenses Breakdown" isEditable={isEditable}>
              <ExpensesPieChart expenses={expenses} />
            </Card>
          </div>
          <div key="trophy-physics">
            <TrophyPhysicsCard userId={user.user_id} isEditable={isEditable} cardX={trophyCardPos.x} cardY={trophyCardPos.y} trophiesList={trophiesList} />
          </div>
        </ResponsiveGridLayout>
        {newTrophy && (
        <TrophyPopup trophy={newTrophy} />
        )}
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
