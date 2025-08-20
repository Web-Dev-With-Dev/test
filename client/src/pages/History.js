import { useEffect, useState } from "react";
import { fetchChartHistory } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function History() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const nav = useNavigate();

  const handleDelete = async (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setDatasets((ds) => ds.filter((d) => d._id !== id));
      setDeletingId(null);
      setConfirmId(null);
    }, 700);
  };

  useEffect(() => {
    fetchChartHistory()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDatasets(res.data);
        } else {
          console.error("❌ Expected array, got:", res.data);
          setDatasets([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching chart history:", err);
        setDatasets([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-white via-[#e0e7ff] to-[#b3b8f7] px-2 md:px-0">
          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Chart History</h2>
            <div className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-xl rounded-2xl overflow-x-auto p-4 animate-fade-in" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}>
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Chart Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Chart Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Created At</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8">
                        <svg className="animate-spin h-6 w-6 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      </td>
                    </tr>
                  ) : datasets.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No files found.</td></tr>
                  ) : (
                    datasets.map((ds, i) => (
                      <motion.tr
                        key={ds._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                        className={`border-b last:border-none hover:bg-indigo-50/40 transition ${deletingId === ds._id ? "opacity-50 blur-[1px] pointer-events-none" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <button className="text-indigo-600 hover:underline font-medium" onClick={() => nav(`/dataset/${ds._id}`)}>
                            {ds.filename}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{ds.chartType || "-"}</td>
                        <td className="px-4 py-3">{new Date(ds.uploadedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {confirmId === ds._id ? (
                            <div className="flex gap-2 items-center">
                              <button
                                className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700 transition"
                                onClick={() => handleDelete(ds._id)}
                                disabled={deletingId === ds._id}
                              >
                                {deletingId === ds._id ? "Deleting..." : "Confirm"}
                              </button>
                              <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold shadow hover:bg-gray-300 transition"
                                onClick={() => setConfirmId(null)}
                                disabled={deletingId === ds._id}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="px-3 py-1 rounded bg-red-100 text-red-600 text-xs font-semibold shadow hover:bg-red-200 transition"
                              onClick={() => setConfirmId(ds._id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
