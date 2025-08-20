import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginUser } from "../services/api";
import LoginIcon from "@mui/icons-material/Login";
import Navbar from '../components/Navbar';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.name) localStorage.setItem("name", data.name);
      if (data.email) localStorage.setItem("email", data.email);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed – check your credentials"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#b3b8f7] font-inter">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 flex flex-col items-center mt-8 mb-8">
          <div className="flex items-center mb-6">
            <LoginIcon className="text-[#7c3aed] mr-2" fontSize="large" />
            <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
          </div>
          {error && <div className="w-full mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center text-sm">{error}</div>}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
              <input
                name="password"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#7c3aed] hover:bg-[#5f2eea] text-white font-semibold py-2 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-gray-600 text-sm text-center">
            New here?{' '}
            <Link to="/register" className="text-[#7c3aed] font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
