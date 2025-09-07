import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Fake login check
    if (form.username === "Admin" && form.password === "admin@1234") {
      localStorage.setItem("authToken", "demo-token");
      navigate("/dashboard"); // Redirect to Dashboard after login
    } else {
      setError("Invalid credentials. Try Demo Login.");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br !from-blue-200 to-gray-400">
      <div className="bg-white dark:bg-panel-dark shadow-lg rounded-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-accent-pink">
            DiagnoMed AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            AI-Powered Medical Diagnostics
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-200 dark:border-gray-600 dark:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-200 dark:border-gray-600 dark:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full !bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {/* Demo Info */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Demo Login: <br />
          Username: <code>Admin</code> <br />
          Password: <code>admin@1234</code>
        </p>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Secure medical diagnostics for healthcare professionals
        </footer>
      </div>
    </div>
  );
}
