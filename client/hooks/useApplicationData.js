// Function to track states and Handle API fetches to render data
import { useState } from "react"
import { getIncome, getExpenses } from "../services/api"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null); // edited income state
    const [expensesList, setExpensesList] = useState([]);

  // Fetch incomes after state changes
  const fetchIncomeList = async () => {
    const data = await getIncome();
    setIncomeList(data);
  }

  // Fetch expenses after state changes
  const fetchExpensesList = async () => {
    const data = await getExpenses();
    setExpensesList(data);
  };

  const onSubmitSuccess = async () => {
    setEditingIncome(null)
    await fetchIncomeList()
  }

  const onExpenseSubmitSuccess = async () => {
    console.log('Fetching updated expenses list...'); // Debugging log
    await fetchExpensesList();
    console.log('Updated expenses list:', expensesList); // Debugging log
  };

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