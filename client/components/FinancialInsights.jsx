import React from 'react';
import { FaArrowLeft, FaLightbulb } from 'react-icons/fa';
import AIInsights from './AIInsights';

const FinancialInsightsPage = ({ expenses = [], income = [], onBack }) => {
  return (
    <div className="financial-insights-page">
      <div className="page-header">
        <button onClick={onBack} className="back-button">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>
          <FaLightbulb className="header-icon" /> Financial Insights
        </h1>
        <p className="subtitle">
          AI-powered analysis of your financial patterns
        </p>
      </div>
      
      <div className="insights-container">
        <AIInsights expenses={expenses} income={income} />
      </div>
    </div>
  );
};

export default FinancialInsightsPage;