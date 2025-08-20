import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { register as registerUser } from '../services/api';
import Navbar from '../components/Navbar';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ text: '', type: 'error' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validPass = v => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validEmail(form.email)) return setMsg({ text: 'Invalid email.', type: 'error' });
    if (!validPass(form.password)) return setMsg({ text: 'Password must be 8+ chars with letter & number.', type: 'error' });
    if (form.password !== confirm) return setMsg({ text: 'Passwords do not match.', type: 'error' });
    try {
      await registerUser(form);
      setMsg({ text: 'Registered successfully! Redirecting...', type: 'success' });
      setTimeout(() => nav('/'), 1500);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Registration failed.', type: 'error' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#b3b8f7] font-inter">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 flex flex-col items-center mt-8 mb-8">
          <div className="flex items-center mb-6">
            <PersonAddIcon className="text-[#7c3aed] mr-2" fontSize="large" />
            <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          </div>
          {msg.text && (
            <div className={`w-full mb-4 text-center text-sm rounded-lg px-4 py-2 border ${msg.type === 'error' ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
              {msg.text}
            </div>
          )}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Full Name</label>
              <input
                name="name"
                id="name"
                type="text"
                value={form.name}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
              <input
                name="password"
                id="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="new-password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="confirm">Confirm Password</label>
              <input
                name="confirm"
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
                autoComplete="new-password"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={form.role}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#7c3aed] hover:bg-[#5f2eea] text-white font-semibold py-2 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-gray-600 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7c3aed] font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
