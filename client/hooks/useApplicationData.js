// Function to track states and Handle API fetches to render data
import { useState } from "react"
import { getIncome } from "../services/api"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([])
    const [editingIncome, setEditingIncome] = useState(null) // edited income state


  const onSubmitSuccess = () => {
    setEditingIncome(null)
    fetchIncomeList()
  }

  // Fetch incomes after state changes
  const fetchIncomeList = async () => {
    const data = await getIncome();
    setIncomeList(data);
  }

  return {
    incomeList,
    setIncomeList,
    getIncome,
    editingIncome,
    setEditingIncome
  }
}

export default useApplicationData;