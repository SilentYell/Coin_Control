import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/AIInsights.scss';

const AIInsights = ({
  expenses,
  income,
  preview = false,
  onViewFullInsights = () => {},
}) => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!expenses.length || !income.length) return;
      setLoading(true);
      try {
        const data = await getAIInsights(
          expenses,
          income,
          preview ? 'overview' : 'detailed'
        );
        setInsights(data.insights);
      } catch (err) {
        setError('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [expenses, income, preview]);

  if (!expenses.length || !income.length) {
    return null; // no render if no data
  }

  // preview until financial tips
  const parts = insights ? insights.split('Financial Tips:') : ['', ''];
  const previewContent = parts[0];

  // content displayed in preview mod
  const contentToRender = preview ? previewContent : insights;
  const paragraphs = contentToRender.split('\n').filter((p) => p.trim());

  return (
    <div className={`ai-insights ${preview ? 'preview-mode' : ''}`}>
      {loading && <p className="loading">Analyzing your finances...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && insights && (
        <>
          <div className="insights-content">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {preview && (
            <button onClick={onViewFullInsights} className="view-more-button">
              View Complete Analysis <FaArrowRight />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AIInsights;
