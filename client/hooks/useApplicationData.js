// Function to track states and Handle API fetches to render data
import { useState } from "react"

const useApplicationData = () => {
  // Track income state --> maybe use reducer later?
    const [incomeList, setIncomeList] = useState([])

  // Fetch income data (GET '/api/income')
  const getIncome = () => {
    fetch('http://localhost:3000/api/income')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      setIncomeList(data) // update the state with the new data
    })
    .catch((err) => {
      console.error('Fetch error:', err.message)
    })
  }

  return {
    incomeList,
    setIncomeList,
    getIncome
  }
}

export default useApplicationData;