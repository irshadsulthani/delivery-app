import { Route, Routes } from "react-router-dom"
import ReatilerSignUp from "../pages/Reatiler/ReatilerSignUp"

function ReatilerRoute() {
  return (
    <div>
      <Routes>
        <Route path="/reatiler/login" element={<ReatilerSignUp />} />
      </Routes>
    </div>
  )
}

export default ReatilerRoute