import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaLightbulb } from 'react-icons/fa';
import AIInsights from './AIInsights';

const FinancialInsightsPage = ({ expenses = [], income = [] }) => {
  return (
    <div className="financial-insights-page">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1>
          <FaLightbulb className="header-icon" /> Financial Insights
        </h1>
        <p className="subtitle">
          AI-powered analysis and recommendations for your finances
        </p>
      </div>
      
      <div className="insights-container">
        <AIInsights expenses={expenses} income={income} />
      </div>
    </div>
  );
};

export default FinancialInsightsPage;