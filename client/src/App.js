import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import DatasetDetail from "./pages/DatasetDetail";
import History from "./pages/History";
import ListDatasets from "./pages/ListDatasets";
import Contact from "./pages/Contact";
import { UploadRefreshProvider } from "./context/UploadRefreshContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Add these imports for admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminFiles from "./components/admin/AdminFiles";
import AdminCharts from "./components/admin/AdminCharts";
import AdminContacts from "./components/admin/AdminContacts";

import AdminFileHistory from "./components/admin/AdminFileHistory";

function App() {
  return (
    <SocketProvider>
      <UploadRefreshProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/datasets" element={<ProtectedRoute><ListDatasets /></ProtectedRoute>} />
            <Route path="/dataset/:id" element={<ProtectedRoute><DatasetDetail /></ProtectedRoute>} />
            
            {/* Admin Routes with AdminRoute protection */}
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/files" element={<AdminRoute><AdminLayout><AdminFiles /></AdminLayout></AdminRoute>} />
            <Route path="/admin/charts" element={<AdminRoute><AdminLayout><AdminCharts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/contacts" element={<AdminRoute><AdminLayout><AdminContacts /></AdminLayout></AdminRoute>} />

            <Route path="/admin/file-history" element={<AdminRoute><AdminLayout><AdminFileHistory /></AdminLayout></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </UploadRefreshProvider>
    </SocketProvider>
  );
}

export default App;
