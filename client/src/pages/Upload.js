import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { useUploadRefresh } from "../context/UploadRefreshContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const chartTypes = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "doughnut", label: "Doughnut" },
];

const MOCK = [
  { Name: "Alice", Score: 90 },
  { Name: "Bob", Score: 80 },
  { Name: "Carol", Score: 70 },
  { Name: "Dan", Score: 60 },
  { Name: "Eve", Score: 50 }
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState(MOCK);
  const [headers, setHeaders] = useState(["Name", "Score"]);
  const [uploading, setUploading] = useState(false);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState(chartTypes[0].value);
  const [chartData, setChartData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);
  const chartRef = useRef();
  const { setNeedsRefresh } = useUploadRefresh();

  useEffect(() => {
    console.log("Upload Mounted");
    const token = localStorage.getItem("token");
    console.log("Token present:", !!token, token);
  }, []);

  // Debug: log previewRows
  useEffect(() => {
    console.log("previewRows:", previewRows);
  }, [previewRows]);

  // Handle file selection
  const pick = e => {
    const f = e.target.files[0];
    console.log("File selected:", f);
    if (f && f.name.endsWith(".xlsx")) {
      setFile(f);
      toast.success("File loaded successfully", { position: "top-center" });
      // Parse for preview
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb = XLSX.read(e.target.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
          setPreviewRows(rows.slice(0, 10));
          setHeaders(rows.length > 0 ? Object.keys(rows[0]) : []);
          setXAxis("");
          setYAxis("");
          setChartData(null);
        } catch (err) {
          toast.error("Failed to parse Excel file.", { position: "top-center" });
          setPreviewRows(MOCK);
          setHeaders(["Name", "Score"]);
        }
      };
      reader.readAsBinaryString(f);
    } else {
      setFile(null);
      toast.error("Please choose a .xlsx file!", { position: "top-center" });
      setPreviewRows(MOCK);
      setHeaders(["Name", "Score"]);
    }
  };

  // Upload and parse file
  // Add this with your other state variables at the top of the component
  const [datasetId, setDatasetId] = useState(null);
  
  // Update the send function to capture the dataset ID
  const send = async () => {
    if (!file) {
      toast.error("Please choose a file first.", { position: "top-center" });
      setPreviewRows(MOCK);
      setHeaders(["Name", "Score"]);
      return;
    }
    setUploading(true);
    try {
      // Import the API function
      const { uploadExcel } = await import("../services/api");
      
      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", file);
      
      // Actually upload the file
      const response = await uploadExcel(formData);
      console.log("📤 Upload response:", response);
      
      // Store the dataset ID for later use
      if (response?.data?.id) {
        const newDatasetId = response.data.id;
        setDatasetId(newDatasetId);
        console.log("✅ Dataset ID stored:", {
          id: newDatasetId,
          filename: file.name,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error("❌ No dataset ID in upload response:", response);
        toast.error("Upload succeeded but no dataset ID received", { position: "top-center" });
      }
      
      toast.success("File uploaded and parsed successfully!", { position: "top-center" });
      if (setNeedsRefresh) setNeedsRefresh(true);
    } catch (err) {
      toast.error("Upload failed!", { position: "top-center" });
      setPreviewRows(MOCK);
      setHeaders(["Name", "Score"]);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Update the handleGenerateChart function to include the dataset ID
  const handleGenerateChart = async () => {
    if (!xAxis || !yAxis || !chartType) {
      toast.error("Please select X, Y axis and chart type!", { position: "top-center" });
      return;
    }
    setGenerating(true);
    setMetaSaved(false); // reset badge
    const labels = previewRows.map(row => row[xAxis]);
    const data = previewRows.map(row => Number(row[yAxis]));
    const chartConfig = {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data,
          backgroundColor: [
            "#7c3aed", "#6366f1", "#a5b4fc", "#c7d2fe", "#818cf8", "#e0e7ff"
          ],
          borderColor: "#7c3aed",
          borderWidth: 2,
        },
      ],
    };
    setChartData(chartConfig);
    toast.success("Chart generated!", { position: "top-center" });
    setGenerating(false);

    // --- Save chart metadata to backend ---
    setMetaSaving(true);
    try {
      // Import the API function
      const { saveChartMeta } = await import("../services/api");
      
      // Debug: Check if datasetId exists
      console.log("🔍 Current datasetId:", datasetId);
      if (!datasetId) {
        console.error("❌ No datasetId available for chart metadata");
        toast.error("Missing dataset ID. Please upload file first.", { position: "top-center" });
        return;
      }

      // Prepare the metadata with all required fields
      const chartMetadata = {
        title: file?.name || "Untitled Chart",
        chartType,
        dataset: {
          xAxis,
          yAxis,
          data: previewRows.map(row => Number(row[yAxis])) // <-- Only the data array!
        },
        uploadedAt: new Date(),
        datasetId // Include the dataset ID
      };
      
      // Log the complete metadata object
      console.log("📤 Sending chart metadata:", {
        title: chartMetadata.title,
        chartType: chartMetadata.chartType,
        datasetId: chartMetadata.datasetId,
        xAxis: chartMetadata.dataset.xAxis,
        yAxis: chartMetadata.dataset.yAxis
      });
      
      // Use the API service instead of fetch
      const res = await saveChartMeta(chartMetadata);
      
      // Verify the response
      console.log("✅ Chart metadata save response:", {
        status: res.status,
        id: res.data._id,
        chartType: res.data.chartType,
        filename: res.data.filename,
        timestamp: new Date().toISOString()
      });
      
      if (res.data && res.data._id) {
        setMetaSaved(true);
        toast.success("Chart metadata saved!", { position: "top-center" });
        
        // Ensure refresh is triggered
        console.log("🔄 Triggering dashboard refresh after successful metadata save");
        setNeedsRefresh(true);
        
        // Double-check refresh state after a short delay
        setTimeout(() => {
          console.log("🔍 Verifying refresh state after metadata save");
          setNeedsRefresh(true);
        }, 100);
      } else {
        console.error("❌ Invalid server response structure:", res.data);
        throw new Error("Invalid response from server - missing _id");
      }
    } catch (err) {
      console.error("❌ Error saving chart metadata:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(err.response?.data?.message || "Failed to save chart metadata", { position: "top-center" });
    } finally {
      setMetaSaving(false);
    }
  };

  // Export chart as PNG
  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    const canvas = chartRef.current.querySelector("canvas");
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "chart.png";
    link.click();
  };

  // Export chart as PDF
  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = chartRef.current.querySelector("canvas");
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save("chart.pdf");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ToastContainer />
        <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-white via-[#e0e7ff] to-[#b3b8f7] px-2 md:px-0">
          <div className="max-w-3xl mx-auto py-8 space-y-8">
            {/* Upload Card */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-xl rounded-2xl p-8 flex flex-col gap-4"
              style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">📤 Upload New File</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose File (.xlsx only)</label>
              <input type="file" accept=".xlsx" className="mb-2" onChange={pick} />
              <button
                className="bg-[#7c3aed] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#5f2eea] transition w-fit"
                onClick={send}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </motion.div>

            {/* Preview Table */}
            {previewRows.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-xl rounded-2xl p-8"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📄 Preview Uploaded Data</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm rounded-xl shadow">
                    <thead className="bg-indigo-50/60">
                      <tr>
                        {headers.map(h => (
                          <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <motion.tr key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                          className="border-b last:border-none hover:bg-indigo-50/40 transition">
                          {headers.map(h => (
                            <td key={h} className="px-4 py-2 text-gray-700">{row[h]}</td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Chart Generation */}
            {previewRows.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-xl rounded-2xl p-8 flex flex-col gap-4"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📊 Generate Chart</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <select className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7c3aed]" value={xAxis} onChange={e => setXAxis(e.target.value)}>
                    <option value="">Select X Axis</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <select className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7c3aed]" value={yAxis} onChange={e => setYAxis(e.target.value)}>
                    <option value="">Select Y Axis</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <select className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7c3aed]" value={chartType} onChange={e => setChartType(e.target.value)}>
                    {chartTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <button
                    className="bg-[#7c3aed] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#5f2eea] transition"
                    onClick={handleGenerateChart}
                    disabled={generating}
                  >
                    {generating ? "Generating..." : "Generate Chart"}
                  </button>
                </div>
                {/* Chart Render + Export */}
                {chartData && (
                  <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/70 rounded-xl shadow p-6 flex flex-col items-center gap-4" ref={chartRef}>
                    {/* Chart Saved Badge */}
                    {metaSaving && (
                      <div className="mb-2 text-xs text-indigo-600 flex items-center gap-1 animate-pulse">Saving chart metadata...</div>
                    )}
                    {metaSaved && !metaSaving && (
                      <div className="mb-2 text-xs text-green-600 flex items-center gap-1">✅ Chart metadata saved!</div>
                    )}
                    {/* Chart Render */}
                    {chartType === "bar" && <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />}
                    {chartType === "line" && <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />}
                    {chartType === "doughnut" && <Doughnut data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />}
                    <div className="flex gap-4 mt-4">
                      <button onClick={handleExportPNG} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-semibold text-sm">
                        💾 Download PNG
                      </button>
                      <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg shadow hover:bg-indigo-200 transition font-semibold text-sm">
                        🧾 Export PDF
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            {/* Always show previewRows JSON for debug */}
            <div className="mt-6">
              <h4 className="font-bold mb-2">Debug previewRows:</h4>
              <pre className="bg-gray-200 rounded p-2 text-xs max-h-40 overflow-auto border border-gray-300">{JSON.stringify(previewRows, null, 2)}</pre>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
