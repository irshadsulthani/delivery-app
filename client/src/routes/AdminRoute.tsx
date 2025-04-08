import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
// import AdminDashboard from '../pages/admin/AdminDashboard';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default AdminRoutes;
