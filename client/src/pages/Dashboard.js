import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../components/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchDashboardData } from "../services/api";
import { motion } from "framer-motion";
import { useUploadRefresh } from "../context/UploadRefreshContext";

export default function Dashboard() {
  const nav = useNavigate();
  const { needsRefresh, setNeedsRefresh } = useUploadRefresh();

  const [totalFiles, setTotalFiles] = useState(0);
  const [uniqueChartTypes, setUniqueChartTypes] = useState(0);
  const [recentUploads, setRecentUploads] = useState([]);
  const [username, setUsername] = useState("User");

  const fetchStats = useCallback(async () => {
    console.log("📊 Fetching dashboard stats...");

    try {
      const { data } = await fetchDashboardData();
      console.log("✅ Dashboard data received:", {
        totalFiles: data.totalFiles,
        uniqueChartTypes: data.uniqueChartTypes,
        recentUploadsCount: data.recentUploads?.length
      });
      
      setTotalFiles(data.totalFiles || 0);
      setUniqueChartTypes(data.uniqueChartTypes || 0);
      setRecentUploads(data.recentUploads || []);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    }
  }, [setTotalFiles, setUniqueChartTypes, setRecentUploads]);

  useEffect(() => {
    fetchStats();
    setUsername(localStorage.getItem("name") || "User");
  }, [fetchStats]);

  useEffect(() => {
    if (needsRefresh) {
      console.log("🔄 Dashboard refresh triggered");
      fetchStats();
      setNeedsRefresh(false);
      console.log("✅ Dashboard refresh complete");
    }
  }, [needsRefresh, setNeedsRefresh, fetchStats]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-white via-[#e0e7ff] to-[#b3b8f7] px-2 md:px-0">
          <div className="max-w-6xl mx-auto mt-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              Welcome back, <span className="text-indigo-500">{username} 👋</span>
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl bg-white/70 shadow-md p-6 text-center"
              >
                <div className="text-xl font-bold text-indigo-700">Uploaded Files</div>
                <div className="text-4xl font-extrabold mt-2 text-gray-900">{totalFiles}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-xl bg-white/70 shadow-md p-6 text-center"
              >
                <div className="text-xl font-bold text-indigo-700">Chart Types</div>
                <div className="text-4xl font-extrabold mt-2 text-gray-900">{uniqueChartTypes}</div>
              </motion.div>
            </div>

            {/* Recent Uploads Table */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-indigo-700">Recent Uploads</h3>
              <button
                onClick={() => nav("/dashboard/upload")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-semibold text-sm"
              >
                <ArrowUpTrayIcon className="h-5 w-5" /> + Upload File
              </button>
            </div>

            <div className="backdrop-blur-lg bg-white/40 border border-white/30 rounded-2xl shadow-xl overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Chart Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Uploaded At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-gray-500">No uploads found.</td></tr>
                  ) : (
                    recentUploads.map((item, i) => (
                      <motion.tr
                        key={item._id || i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                        className="border-b last:border-none hover:bg-indigo-50 transition"
                      >
                        <td className="px-4 py-3">{item.filename}</td>
                        <td className="px-4 py-3 text-gray-500">{item.chartType || '-'}</td>
                        <td className="px-4 py-3">{new Date(item.uploadedAt).toLocaleString()}</td>
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
