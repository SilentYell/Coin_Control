import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import { FaArrowRight, FaLightbulb } from 'react-icons/fa';
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

  // place holder when no data
  if (!expenses.length || !income.length) {
    return (
      <div className="ai-insights placeholder-mode">
        <div className="ai-insights-header">
          <div className="gemini-branding">
            <SiGoogle className="google-icon" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>

        <div className="insights-placeholder">
          <div className="placeholder-icon">
            <FaLightbulb />
          </div>
          <h3>AI Financial Insights On The Way</h3>
          <p>
            Add both expense and income data to activate your personalized
            financial analysis.
          </p>
          <ul>
            <li>Track your spending patterns</li>
            <li>Get personalized savings recommendations</li>
            <li>Receive budget optimization tips</li>
          </ul>
        </div>
      </div>
    );
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
