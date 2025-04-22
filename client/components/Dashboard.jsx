import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Dashboard.scss';
import Card from './Card';
import GoalCard from './GoalCard';
import ExpensesPieChart from './ExpensesPieChart';
import AIInsights from './AIInsights';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaArrowLeft, FaLightbulb } from 'react-icons/fa';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ expenses = [], income = [] }) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [goal, setGoal] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showFinancialInsights, setShowFinancialInsights] = useState(false);

  // Track layout state to detect width for compact mode
  const [layoutState, setLayoutState] = useState([
    { i: 'goal', x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 1 },
    { i: 'expenses', x: 0, y: 2, w: 2, h: 2 },
    { i: 'income', x: 2, y: 2, w: 2, h: 2 },
    { i: 'balance', x: 4, y: 2, w: 2, h: 2 },
    { i: 'savings', x: 0, y: 4, w: 2, h: 2 },
    { i: 'ai-insights', x: 2, y: 4, w: 2, h: 3 },
    { i: 'pie-chart', x: 4, y: 4, w: 2, h: 6 },
  ]);

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
    } catch (err) {
      setGoal(null);
      setTotalSavings(0);
    }
  }, []);

  // Remove goal from dashboard state when completed
  const handleGoalComplete = (goalId) => {
    setGoal(null);
    setTotalSavings(0);
  };

  // Fetch goal on mount and whenever income/expenses or goal changes
  useEffect(() => {
    fetchGoal();
  }, [fetchGoal, income, expenses, goal]);

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
    setCurrentBalance(totalIncome - totalExpenses - totalSavings);
  }, [expenses, income, totalSavings, goal]);

  return (
    <div className="dashboard">
      {showFinancialInsights ? (
        // Full Financial Insights View
        <div className="financial-insights-view">
          <button
            onClick={() => setShowFinancialInsights(false)}
            className="back-button"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>
            <FaLightbulb className="header-icon" /> Financial Insights
          </h1>
          <p className="subtitle">AI-powered analysis of your financial data</p>

          <div className="insights-container">
            <AIInsights expenses={expenses} income={income} />
          </div>
        </div>
      ) : (
        <>
          <h1>Dashboard</h1>

          <button
            onClick={() => setIsEditable((prev) => !prev)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: isEditable ? '#e53e3e' : '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            {isEditable ? 'Lock Layout' : 'Unlock Layout'}
          </button>
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
              onResizeStop={(newLayout) => setLayoutState(newLayout)}
              preventCollision={true}
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
                  value={`$${Number(totalExpenses || 0).toFixed(2)}`}
                  description="Track your spending here."
                />
              </div>
              <div key="income">
                <Card
                  title="Total Income"
                  value={`$${Number(totalIncome || 0).toFixed(2)}`}
                  description="Monitor your earnings."
                />
              </div>
              <div key="balance">
                <Card
                  title="Current Balance"
                  value={`$${Number(currentBalance || 0).toFixed(2)}`}
                  description="Your current financial status (after savings)."
                />
              </div>
              <div key="savings">
                <Card
                  title="Total Savings"
                  value={`$${Number(totalSavings || 0).toFixed(2)}`}
                  description="Total allocated to your savings goals."
                />
              </div>
              <div key="ai-insights">
                <Card title="Financial Insights">
                  <AIInsights
                    expenses={expenses}
                    income={income}
                    preview={true}
                    maxPreviewLines={2}
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
