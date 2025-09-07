import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Diagnostics from "./pages/Diagnostics";
import History from "./pages/History";
import NewDiagnosis from "./pages/NewDiagnosis";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

// Protected Route Component
function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("authToken");
  return authToken ? children : <Navigate to="/" replace />;
}

function AppLayout() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostics"
          element={
            <ProtectedRoute>
              <Diagnostics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newdiagnosis"
          element={
            <ProtectedRoute>
              <NewDiagnosis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />
        {/* All other app routes */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
