import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/AIInsights.scss';
import { SiGoogle } from 'react-icons/si';

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
      } catch {
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
      {/* Google Gemini branding header */}
      <div className="ai-insights-header">
        <div className="gemini-branding">
          <SiGoogle className="google-icon" />
          <span>Powered by Gemini AI</span>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-animation"></div>
          <p className="loading">Google Gemini is analyzing your finances...</p>
        </div>
      )}

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

      {/* Add footer attribution */}
      {!loading && !error && insights && (
        <div className="ai-attribution">
          Financial analysis powered by Google Gemini
        </div>
      )}
    </div>
  );
};

export default AIInsights;
