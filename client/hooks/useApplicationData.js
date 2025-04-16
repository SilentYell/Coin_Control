// Function to track states and Handle API fetches to render data
import { useState, useCallback } from "react"
import { getIncome, getExpenses } from "../services/api"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null); // edited income state
    const [expensesList, setExpensesList] = useState([]);

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
    console.log('Updated income list:', updatedData);
    setEditingIncome(null);
  }, [fetchIncomeList]);

  const onExpenseSubmitSuccess = useCallback(async () => {
    // fetch only when needed after adding/editing expense
    const updatedData = await fetchExpensesList();
    console.log('Updated expenses list:', updatedData); // log returned data
  }, [fetchExpensesList]);

  return {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    onSubmitSuccess,
    expensesList,
    setExpensesList,
    fetchExpensesList,
    onExpenseSubmitSuccess
  }
}

export default useApplicationData;