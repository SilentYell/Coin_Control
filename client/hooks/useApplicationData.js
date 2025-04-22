// Function to track states and Handle API fetches to render data
import { useState, useCallback } from "react"
import { getIncome, getExpenses } from "../services/api"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null); // edited income state
    const [editingExpense, setEditingExpense] = useState(null); // edited expense state
    const [editTransactionType, setEditTransactionType] = useState(null); // edit transaction
    const [expensesList, setExpensesList] = useState([]);
    const [editSuccess, setEditSuccess] = useState(false); // track edit success -- for success message
    const [lastEditedTransactionType, setLastEditedTransactionType] = useState(null); // track transaction type edited -- for success message
    const [lastEditedId, setLastEditedId] = useState(null); // track last edit ID -- for visual edit confirmation

  // Fetch incomes after state changes //ph change - use callback to prevent recreation
  const fetchIncomeList = useCallback(async () => {
    try {
      const data = await getIncome();
      setIncomeList(data);
      return data;
    } catch (error) {
      console.error("Error fetching income data:", error);
      return [];
    }
  }, []);

  // Fetch expenses after state changes //ph change - use callback to prevent recreation
  const fetchExpensesList = useCallback(async () => {
    try {
      const data = await getExpenses();
      setExpensesList(data);
      return data;
    } catch (error) {
      console.error("Error fetching expense data:", error);
      return [];
    }
  }, []);

  const onSubmitSuccess = useCallback(async () => {
    const updatedData = await fetchIncomeList();
    setEditingIncome(null);
  }, [fetchIncomeList]);

  const onExpenseSubmitSuccess = useCallback(async () => {
    // fetch only when needed after adding/editing expense
    const updatedData = await fetchExpensesList();
  }, [fetchExpensesList]);

  return {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    editingExpense,
    setEditingExpense,
    editTransactionType,
    setEditTransactionType,
    onSubmitSuccess,
    expensesList,
    setExpensesList,
    fetchExpensesList,
    onExpenseSubmitSuccess,
    editSuccess,
    setEditSuccess,
    lastEditedTransactionType,
    setLastEditedTransactionType,
    lastEditedId,
    setLastEditedId
  }
}

export default useApplicationData;