import React, { useState, useEffect, memo } from 'react';
import '../styles/Dashboard.scss';
import '../styles/GoalCard.scss';
import Card from './Card';

/**
 * GoalCard displays the savings goal progress as a bar or compact summary.
 * @param {Object} props
 * @param {Object} props.goal - The savings goal object
 * @param {number} props.saved - Amount saved so far
 * @param {Function} props.onGoalComplete - Callback when goal is completed
 * @param {boolean} props.isEditable - Whether the card is editable
 */
const GoalCard = ({ goal, saved, onGoalComplete, isEditable }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (goal && goal.amount > 0 && saved >= goal.amount) {
      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
        if (onGoalComplete) onGoalComplete(goal.goal_id);
      }, 1800);
    }
  }, [goal, saved, onGoalComplete]);

  if (!goal) {
    return (
      <Card isEditable={isEditable}>
        <div className="goal-card empty">
          <div style={{ color: '#876510', fontWeight: 600 }}>No savings goal set.</div>
        </div>
      </Card>
    );
  }
  if (completed) {
    return (
      <Card isEditable={isEditable}>
        <div className="goal-card">
          <div className="completed">🎉 GOAL COMPLETED! 🎉</div>
        </div>
      </Card>
    );
  }
  const percent = goal.amount > 0 ? Math.min((saved / goal.amount) * 100, 100) : 0;
  return (
    <Card title={goal.name} isEditable={isEditable}>
      <div className="goal-card-desc">Goal: ${Number(goal.amount).toFixed(2)} &nbsp;|&nbsp; Save {goal.percent}% of income</div>
      <div className="goal-card-progress-bar">
        <div className="goal-card-progress" style={{ width: `${percent}%` }} />
        <div className="goal-card-progress-label">
          Saved: ${Number(saved).toFixed(2)} / ${Number(goal.amount).toFixed(2)} ({percent.toFixed(0)}%)
        </div>
      </div>
    </Card>
  );
};

export default memo(GoalCard);
