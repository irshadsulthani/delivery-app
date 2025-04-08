import { Route, Routes } from "react-router-dom"
import CustomerSignUp from "../pages/customer/CustomerSignUp"

function CustomerRoute() {
  return (
      <Routes>
        <Route path="/sign-up" element={<CustomerSignUp />} />
      </Routes>
  )
}

export default CustomerRoute