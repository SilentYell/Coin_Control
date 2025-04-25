import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Category colours match ExpenseList.scss colours for consistency
const CATEGORY_COLORS = {
  Groceries: '#1e4210',      // Dark green
  Transportation: '#2b6cb0', // Blue
  Entertainment: '#876510',  // Gold/brown
  Utilities: '#553c9a',      // Purple
  Housing: '#822727',        // Dark red
  Healthcare: '#1e584b',     // Teal
  Education: '#0b7285',      // Cyan/Teal
  Personal: '#805ad5',       // Light purple
  Other: '#4a5568'           // Gray
};

const ExpensesPieChart = ({ expenses }) => {
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading chart...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesPieChart;