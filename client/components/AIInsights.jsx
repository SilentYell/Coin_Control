import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/AIInsights.scss';

const AIInsights = ({
  expenses,
  income,
  preview = false,
  maxPreviewLines = 3,
  onViewFullInsights = () => {},
}) => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      // fetch if there is data
      if (!expenses.length || !income.length) return;
      setLoading(true);
      try {
        const data = await getAIInsights(
          expenses,
          income,
          preview ? 'overview' : 'detailed'
        );
        setInsights(data.insights);
        // Trigger grid layout recalculation after content loads
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100); // slight delay ensures DOM updates
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

  // split content into paragraphs for rendering
  const displayParagraphs = contentToRender.split('\n').filter(p => p.trim());

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
