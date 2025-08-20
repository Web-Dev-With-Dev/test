import { useContext, useEffect, useState } from "react";
import { fetchChartHistory } from "../services/api"; // ✅ Correct import
import {
  Box, Typography, Button, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UploadRefreshContext from "../context/UploadRefreshContext";
import { motion } from "framer-motion";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export default function ListDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { needsRefresh, setNeedsRefresh } = useContext(UploadRefreshContext);

  const fetchHistory = () => {
    fetchChartHistory()
      .then(res => {
        if (Array.isArray(res.data)) {
          setDatasets(res.data);
        } else {
          console.error("Expected an array for datasets", res.data);
          setDatasets([]);
        }
      })
      .catch(() => alert("Failed to load datasets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (needsRefresh) {
      fetchHistory();
      setNeedsRefresh(false);
    }
  }, [needsRefresh, setNeedsRefresh]);

  return (
    <Box mt={6} px={3}>
      <Typography variant="h5" gutterBottom>Uploaded Datasets</Typography>
      <div className="max-w-2xl mx-auto w-full overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {loading ? <CircularProgress /> : (
          <div className="flex flex-col gap-3">
            {datasets.map(ds => (
              <motion.div
                key={ds._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-white/80 shadow-md p-4 my-2 hover:bg-indigo-50 flex items-center gap-4"
              >
                <ChartBarIcon className="h-8 w-8 text-indigo-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-indigo-700">{ds.filename}</h3>
                  <p className="text-sm text-gray-600">Chart Type: {ds.type || ds.chartType || '-'}</p>
                  <p className="text-sm text-gray-500">Uploaded: {new Date(ds.uploadedAt).toLocaleString()}</p>
                </div>
                <Button variant="contained" onClick={() => nav(`/dataset/${ds._id}`)}>
                  View
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
