import React, { useState, useEffect, useRef, memo } from 'react';
import anime from 'animejs/lib/anime.es.js';
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
  const [displayedSaved, setDisplayedSaved] = useState(0);
  const [displayedPercent, setDisplayedPercent] = useState(0);
  const progressRef = useRef(null);
  const shimmerRef = useRef(null);
  const labelRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (goal && goal.amount > 0 && saved >= goal.amount) {
      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
        if (onGoalComplete) onGoalComplete(goal.goal_id);
      }, 1800);
    }
  }, [goal, saved, onGoalComplete]);

  useEffect(() => {
    if (!goal) return;
    const percent = goal.amount > 0 ? Math.min((saved / goal.amount) * 100, 100) : 0;
    // Animate progress bar width (no elastic)
    anime({
      targets: progressRef.current,
      width: percent + '%',
      easing: 'easeOutCubic',
      duration: 900,
    });
    // Animate shimmer
    if (shimmerRef.current) {
      shimmerRef.current.classList.remove('shimmer-animate');
      void shimmerRef.current.offsetWidth;
      shimmerRef.current.classList.add('shimmer-animate');
    }
    // Animate glow pulse
    if (progressRef.current) {
      progressRef.current.classList.remove('glow-pulse');
      void progressRef.current.offsetWidth;
      progressRef.current.classList.add('glow-pulse');
    }
    // Animate label number counting up
    anime({
      targets: { val: displayedSaved },
      val: saved,
      round: 100,
      duration: 1000,
      easing: 'easeOutExpo',
      update: anim => {
        setDisplayedSaved(anim.animations[0].currentValue);
        setDisplayedPercent(percent * (anim.progress / 100));
      },
      complete: () => {
        setDisplayedSaved(saved);
        setDisplayedPercent(percent);
      }
    });
    // Confetti on 100%
    if (percent === 100 && confettiRef.current) {
      confettiRef.current.classList.add('confetti-burst');
      setTimeout(() => confettiRef.current && confettiRef.current.classList.remove('confetti-burst'), 1200);
    }
    // eslint-disable-next-line
  }, [goal, saved]);

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
  
  return (
    <Card title={goal.name} isEditable={isEditable}>
      <div className="goal-card-desc">Goal: ${Number(goal.amount).toFixed(2)} &nbsp;|&nbsp; Save {goal.percent}% of income</div>
      <div className="goal-card-progress-bar">
        <div className="goal-card-progress" ref={progressRef}>
          <div className="goal-card-shimmer" ref={shimmerRef} />
        </div>
        <div className="goal-card-progress-label" ref={labelRef}>
          Saved: ${Number(displayedSaved).toFixed(2)} / ${Number(goal.amount).toFixed(2)} ({Math.round(displayedPercent)}%)
        </div>
        <div className="goal-card-confetti" ref={confettiRef} />
      </div>
    </Card>
  );
};

export default memo(GoalCard);
