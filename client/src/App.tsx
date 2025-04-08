import { BrowserRouter } from 'react-router-dom';

import AdminRoutes from './routes/AdminRoute';
import DeliveryBoyRoute from './routes/DeliveryBoyRoute';
import CustomerRoute from './routes/CustomerRoute';
import ReatilerRoute from './routes/ReatilerRoute';


function App() {
  return (
    <BrowserRouter>
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
