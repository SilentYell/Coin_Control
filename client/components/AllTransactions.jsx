import React, { useEffect, useState } from 'react'
import { getAllTransactions, deleteTransaction, getIncomeById, getExpenseById } from '../services/api.js';
import formatDate from '../src/helpers/formatDate';
import { MdEdit, MdDelete } from 'react-icons/md';
import '../styles/AllTransactions.scss'

const AllTransactions = ({
    setEditTransactionType,
    onEditIncome,
    setIncomeList,
    onEditExpense,
    setExpensesList,
    setShowTransactionsModal,
    editSuccess,
    lastEditedTransactionType,
    lastEditedId,
    triggerRefresh
  }) => {

  const [transactionsList, setTransactionsList] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState('All');
  const [error, setError] = useState(null);

  // filter transactions by selected type
  const filteredTransactionList =
    selectedTransactionType === 'All'
      ? transactionsList
      : transactionsList.filter((transaction) => transaction.type === selectedTransactionType);


  useEffect(() => {

    // Fetch transaction data from the backend when the component mounts
    const fetchTransaction = async () => {
      try {
        const data = await getAllTransactions();
        setTransactionsList(data); // Updates the state with fetched data
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    // PH change - only fetch if we dont have data
    if (!transactionsList || transactionsList.length === 0) {
      fetchTransaction();
    }
  }, []);


  const handleEdit = async (transaction) => {
    if (transaction.type ==='Income') {
      const fullIncome = await getIncomeById(transaction.id);
      onEditIncome(fullIncome);
    } else {
      const fullExpense = await getExpenseById(transaction.id);
      onEditExpense(fullExpense);
    }

    setEditTransactionType(transaction.type)
    setShowTransactionsModal(true)
  };


  const handleDelete = async (id, type) => {
    try {
      await deleteTransaction(id, type); // call to backend

      if (type === 'Income') {
        setIncomeList((prevList) => prevList.filter((item) => item.income_id !== id));
      } else if (type === 'Expense') {
        console.log(type)
        setExpensesList((prevList) => prevList.filter((item) => item.expense_id !== id));
      }

      // Update transactions List if needed
      setTransactionsList((prevList) =>
        prevList.filter((item) => !(item.id === id && item.type === type))
      );

      triggerRefresh(); // refresh line graph

    } catch (error) {
      setError('Failed to delete transaction. Please try again later.');
      console.error('Error deleting transaction:', error.message);
    }
  };

  return (
    <div className="transactions-list">
      <h2>All Transactions</h2>

      {editSuccess && (
        <div className="success-message">{lastEditedTransactionType} updated successfully!</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Add transaction type filter */}
      <div className="filter-controls">
        <label htmlFor="transaction-type-filter">Filter by transaction type: </label>
        <select
          id="transaction-type-filter"
          value={selectedTransactionType}
          onChange={(e) => setSelectedTransactionType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {filteredTransactionList.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found. Add income or expenses to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactionList.map((transaction) => (
                <tr
                  key={transaction.uid}
                  className={
                    lastEditedId?.id === transaction.id &&
                    lastEditedId?.type === transaction.type
                    ? 'highlight-row'
                    : ''
                  }
                >
                  <td className={`transaction ${Number(transaction.amount) > 0 ? 'amount-positive' : 'amount-negative'} `}>
                    ${Number(transaction.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <span className={`type-tag ${transaction.type}`}>{transaction.type}</span>
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit((transaction))
                      }
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id, transaction.type)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td className="total-label">Total</td>
                <td
                  colSpan="4"
                  className={
                    'total-amount ' +
                    (filteredTransactionList.reduce(
                      (sum, transaction) => sum + Number(transaction.amount),
                      0
                    ) < 0
                      ? 'negative'
                      : 'positive')
                  }
                >
                  {/* Format transaction amounts and totals with commas and two decimals for better readability */}
                  ${filteredTransactionList
                    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
                    .toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;