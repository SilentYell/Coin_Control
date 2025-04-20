import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getExpenses } from '../services/api';

// Category colours match ExpenseList.scss colours for consistency
const CATEGORY_COLORS = {
  Groceries: '#1e4210', 
  Transportation: '#2b6cb0', 
  Entertainment: '#876510', 
  Utilities: '#553c9a', 
  Housing: '#822727', 
  Healthcare: '#1e584b', 
  Education: '#2b6cb0', 
  Personal: '#553c9a', 
  Other: '#4a5568'
};

const ExpensesPieChart = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Group expenses by category and sum amounts
  const groupedData = expenses.reduce((acc, curr) => {
    const { category, amount } = curr;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(amount);
    return acc;
  }, {});

  // Convert grouped object into array for chart
  const chartData = Object.entries(groupedData).map(([name, value]) => ({
    name, value
  }))

  // Loading message for initial webpage entry
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading chart...</div>;
  }

return (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={true}
        outerRadius={140}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
        ))}
      </Pie>
      <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
)}

export default ExpensesPieChart;