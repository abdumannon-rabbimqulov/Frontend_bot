import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import DriverProfileForm from './pages/DriverProfileForm';
import Dashboard from './pages/Dashboard';
import Loads from './pages/Loads';
import LoadDetail from './pages/LoadDetail';
import ActiveTrip from './pages/ActiveTrip';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter basename="/drivers">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><DriverProfileForm /></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute requireProfile><Dashboard /></ProtectedRoute>} />
          <Route path="/loads" element={<ProtectedRoute requireProfile><Loads /></ProtectedRoute>} />
          <Route path="/loads/:id" element={<ProtectedRoute requireProfile><LoadDetail /></ProtectedRoute>} />
          <Route path="/active" element={<ProtectedRoute requireProfile><ActiveTrip /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute requireProfile><Chat /></ProtectedRoute>} />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
