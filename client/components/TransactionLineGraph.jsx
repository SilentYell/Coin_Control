import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getTransactionDates } from '../services/api';
import formatDate from '../src/helpers/formatDate';

/**
 * Transforms an array of transaction records into a format suitable for Recharts LineChart.
 *
 * - Groups transactions by date.
 * - Separates totals for income and expense.
 * - Formats dates for display
 * - Sorts the resulting array by date in ascending order.
 *
 * @param {Array} dates - Array of transaction objects containing type, amount and txn_date.
 * @returns {Array} transformed - Array of objects with { date, income, expense } fields, sorted by date.
 */
const transformDates = (dates) => {
  const groupedByDate = {};

  for (const date of dates) {
    console.log('date in loop: ', date)
    const { type, amount, txn_date } = date

    // check if groupedByDates object exists, if not initialize it
    if (!groupedByDate[txn_date]) {
    const formattedDate = formatDate(date.txn_date)
      groupedByDate[txn_date] = {
        date: formattedDate,
        income: 0,
        expense: 0,
      };
    }

    if (type === 'Income') {
      groupedByDate[txn_date].income += Number(amount);
    } else if (type === 'Expense') {
      groupedByDate[txn_date].expense += Number(amount);
    }
  }

  // turn objects into an array
  const transformed = Object.values(groupedByDate)

  // sort by txn_date ascending
  transformed.sort((a,b) => new Date(a.date) - new Date(b.date))

  return transformed;
};


const TransactionLineGraph = ({ refreshSignal }) => {
  const [transactionDates, setTransactionDates] = useState([]);
  const userId = 1;
  useEffect(() => {
    getTransactionDates(userId)
    .then((dates) => transformDates(dates))
    .then((transformed) => {
      setTransactionDates(transformed)
    })
    .catch((error) => console.error(error));


  }, [refreshSignal]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart width={730} height={250} data={transactionDates}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#1E4210" strokeWidth="4"/>
        <Line type="monotone" dataKey="expense" stroke="#c53030" strokeWidth="4"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TransactionLineGraph;