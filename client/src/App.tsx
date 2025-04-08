import { BrowserRouter } from 'react-router-dom';

import AdminRoutes from './routes/AdminRoute';
import DeliveryBoyRoute from './routes/DeliveryBoyRoute';
import CustomerRoute from './routes/CustomerRoute';
import ReatilerRoute from './routes/ReatilerRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" />
      <>
        <AdminRoutes />
        <DeliveryBoyRoute />
        <CustomerRoute />
        <ReatilerRoute />
      </>
    </BrowserRouter>
  );
}

export default App;
