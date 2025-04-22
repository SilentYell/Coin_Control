import React, { useState, useEffect, useRef } from 'react';
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
  const [visibleLines, setVisibleLines] = useState(maxPreviewLines);
  const containerRef = useRef(null);

  // Track resize to show more content when space increases
  useEffect(() => {
    if (!preview) return; // Only apply in preview mode
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      // Calculate how many lines can fit based on container height
      const height = containerRef.current.clientHeight;
      const lineHeight = 24; 
      const buttonHeight = 40; // Space for button
      const availableHeight = height - buttonHeight;
      const possibleLines = Math.floor(availableHeight / lineHeight);
      
      // Set visible lines between min and max values
      const newVisibleLines = Math.max(
        2, // Minimum 2 lines
        Math.min(
          possibleLines,
          insights ? insights.split('\n').filter(p => p.trim()).length : maxPreviewLines
        )
      );
      
      setVisibleLines(newVisibleLines);
    };

    // Call on mount and when resized
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [preview, insights, maxPreviewLines]);

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
