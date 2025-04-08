import { Route, Routes, useLocation } from "react-router-dom";
import CustomerSignUp from "../pages/customer/CustomerSignUp";
import CustomerHome from "../pages/customer/CustomerHome";
import Navbar from "../components/CustomerComponents/Navbar";

function CustomerRoute() {
  const location = useLocation();

  // Paths where Navbar should be hidden
  const hideNavbarOnPaths = ["/sign-up", "/login"];

  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/sign-up" element={<CustomerSignUp />} />
        <Route path="/" element={<CustomerHome />} />
        {/* Add your login route if needed */}
        {/* <Route path="/login" element={<CustomerLogin />} /> */}
      </Routes>
    </>
  );
}

export default CustomerRoute;
