import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import { FaLightbulb, FaArrowRight } from 'react-icons/fa';
import '../styles/AIInsights.scss';

const AIInsights = ({
  expenses,
  income,
  preview = false,
  maxPreviewLines = 3,
}) => {
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

  // split text into paragraphs
  const paragraphs = insights.split('\n').filter((p) => p.trim());
  // preview mode
  const displayParagraphs = preview
    ? paragraphs.slice(0, maxPreviewLines)
    : paragraphs;

  return (
    <div className={`ai-insights ${preview ? 'preview-mode' : ''}`}>
      {loading && <p className="loading">Analyzing your finances...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && insights && (
        <>
          <div className="insights-content">
            {displayParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {preview && paragraphs.length > maxPreviewLines && (
              <p className="truncated">...</p>
            )}
          </div>

          {preview && (
            <Link to="/financial-assistant" className="view-more-button">
              View Complete Analysis <FaArrowRight />
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default AIInsights;
