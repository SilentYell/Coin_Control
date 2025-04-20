import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getExpenses } from '../services/api';

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

  const groupedData = expenses.reduce((acc, curr) => {
    const { category, amount } = curr;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(amount);
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([name, value]) => ({
    name, value
  }))

return (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
)}

export default ExpensesPieChart;