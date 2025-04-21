import React, { useEffect, useState } from 'react'
import { getAllTransactions, deleteTransaction, getIncomeById, getExpenseById } from '../services/api.js';
import formatDate from '../src/helpers/formatDate';
import { MdEdit, MdDelete } from 'react-icons/md';
import '../styles/AllTransactions.scss'

const AllTransactions = ({ setEditTransactionType, onEditIncome, onEditExpense, setShowTransactionsModal }) => {
  const [transactionsList, setTransactionsList] = useState([]);

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
    console.log('handle edit trans.: ', transaction)
    if (transaction.type ==='Income') {
      const fullIncome = await getIncomeById(transaction.id);
      onEditIncome(fullIncome);
    } else {
      const fullExpense = await getExpenseById(transaction.id);
      console.log('fetch fullexpense: ', fullExpense)
      onEditExpense(fullExpense);
    }

    setEditTransactionType(transaction.type)
    setShowTransactionsModal(true)
  };


  const handleDelete = async (id, type) => {
    try {
      await deleteTransaction(id, type); // call to backend

      // ph change - dont fetch again, update state locally
      setTransactionsList((prevList) =>
        prevList.filter((item) => !(item.id === id && item.type === type))
      );
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  return (
    <div className="transactions-list">
      <h2>All Transactions</h2>

      {transactionsList.length === 0 ? (
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
              {transactionsList.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="amount">{transaction.amount}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.type}</td>
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
                  colSpan="2"
                  className={
                    'total-amount ' +
                    (transactionsList.reduce(
                      (sum, transaction) => sum + Number(transaction.amount),
                      0
                    ) < 0
                      ? 'negative'
                      : 'positive')
                  }
                >
                  $
                  {transactionsList
                    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
                    .toFixed(2)}
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