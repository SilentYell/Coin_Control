// Function to track states and Handle API fetches to render data
import { useState } from "react"
import { getIncome } from "../services/api"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null); // edited income state

  // Fetch incomes after state changes
  const fetchIncomeList = async () => {
    const data = await getIncome();
    setIncomeList(data);
  }

  const onSubmitSuccess = async () => {
    setEditingIncome(null)
    await fetchIncomeList()
  }

  return {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome,
    onSubmitSuccess
  }
}

export default useApplicationData;