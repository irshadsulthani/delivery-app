import { Route, Routes } from "react-router-dom"
import DeliveryBoySignUp from "../pages/DeliveryBoy/DeliveryBoySignUp"

function DeliveryBoyRoute() {
  return (
    <div>
      <Routes>
        <Route path="/delivey/sign-up" element={ <DeliveryBoySignUp /> } />
      </Routes>
    </div>
  )
}

export default DeliveryBoyRoute