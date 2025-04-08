import { Route, Routes } from "react-router-dom"
import CustomerSignUp from "../pages/customer/CustomerSignUp"
import CustomerHome from "../pages/customer/CustomerHome"

function CustomerRoute() {
  return (
      <Routes>
        <Route path="/sign-up" element={<CustomerSignUp />} />
        <Route path="/"  element={<CustomerHome />} />
      </Routes>
  )
}

export default CustomerRoute