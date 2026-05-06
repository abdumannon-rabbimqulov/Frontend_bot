import { Routes, Route } from 'react-router-dom';

import AdminLayout from './components/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UsersPage from './pages/Users.jsx';
import OrdersPage from './pages/Orders.jsx';
import LiveMonitoring from './pages/LiveMonitoring.jsx';
import AiLogs from './pages/AiLogs.jsx';
import TruckTypes from './pages/TruckTypes.jsx';
import Tariffs from './pages/Tariffs.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="live" element={<LiveMonitoring />} />
        <Route path="ai-logs" element={<AiLogs />} />
        <Route path="truck-types" element={<TruckTypes />} />
        <Route path="tariffs" element={<Tariffs />} />
      </Route>
    </Routes>
  );
}
