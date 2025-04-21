import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import '../styles/AIInsights.scss';

const AIInsights = ({ expenses, income }) => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      // fetch if there is data
      if (!expenses.length || !income.length) {
        return;
      }
      
      setLoading(true);
      try {
        const data = await getAIInsights(expenses, income);
        setInsights(data.insights);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [expenses, income]);

  if (!expenses.length || !income.length) {
    return null; // no render if no data
  }

  return (
    <div className="ai-insights">
      {/* <h3>Financial Insights</h3> */}
      {loading && <p className="loading">Analyzing your finances...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && insights && (
        <div className="insights-content">
          {insights.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;