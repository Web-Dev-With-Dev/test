import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import ChartPreviewModal from './ChartPreviewModal';

// Environment-based URL configuration
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

export default function AdminCharts() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewChart, setPreviewChart] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewingId, setPreviewingId] = useState(null);

  // Auth headers helper
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchCharts();
    const intervalId = setInterval(fetchCharts, 30000); // refresh every 30s
    return () => clearInterval(intervalId);
  }, []);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/charts`, getAuthHeaders());
      setCharts(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch charts');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewChart = async (chartId) => {
    setPreviewingId(chartId);
    try {
      const response = await axios.get(`${BASE_URL}/admin/charts/${chartId}/preview`, getAuthHeaders());
      setPreviewChart(response.data);
      setIsPreviewOpen(true);
    } catch (error) {
      handleApiError(error, 'Failed to load chart preview');
    } finally {
      setPreviewingId(null);
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) return;
    
    setDeletingId(chartId);
    try {
      await axios.delete(`${BASE_URL}/admin/charts/${chartId}`, getAuthHeaders());
      setCharts(charts.filter(chart => chart._id !== chartId));
      toast.success('Chart deleted successfully');
    } catch (error) {
      handleApiError(error, 'Failed to delete chart');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApiError = (error, defaultMessage) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      // Optional: redirect to login
      // navigate('/login');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Admin privileges required.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else {
      toast.error(defaultMessage);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'No Date';
  };

  const getChartTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bar': return '📊';
      case 'line': return '📈';
      case 'doughnut': return '🍩';
      case 'pie': return '🥧';
      case 'scatter': return '🔍';
      default: return '📊';
    }
  };

  const filteredCharts = charts.filter(chart =>
    chart.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chart.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chart.uploadedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading charts..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Chart Metadata</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search charts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={fetchCharts}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Charts Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chart Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chart Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Axes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCharts.map((chart) => (
                <tr key={chart._id} className="hover:bg-gray-50">
                  {/* Chart Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg">{getChartTypeIcon(chart.chartType)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{chart.title || 'Untitled Chart'}</div>
                        <div className="text-sm text-gray-500">{chart.filename}</div>
                      </div>
                    </div>
                  </td>

                  {/* Chart Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      chart.chartType === 'bar' ? 'bg-blue-100 text-blue-800' :
                      chart.chartType === 'line' ? 'bg-green-100 text-green-800' :
                      chart.chartType === 'doughnut' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {chart.chartType || 'N/A'}
                    </span>
                  </td>

                  {/* Axes */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>X: {chart.dataset?.xAxis || 'N/A'}</div>
                      <div>Y: {chart.dataset?.yAxis || 'N/A'}</div>
                    </div>
                  </td>

                  {/* Uploaded By */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{chart.uploadedBy?.email || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{chart.uploadedBy?.name || ''}</div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(chart.uploadedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewChart(chart._id)}
                        disabled={previewingId === chart._id}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        {previewingId === chart._id ? 'Loading...' : 'Preview'}
                      </button>
                      <button
                        onClick={() => handleDeleteChart(chart._id)}
                        disabled={deletingId === chart._id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === chart._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCharts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching charts found' : 'No charts created yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Charts will appear here once users start uploading'}
          </p>
        </div>
      )}

      {/* Summary */}
      {charts.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{charts.length}</div>
              <div className="text-sm text-indigo-600">Total Charts</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {charts.filter(chart => chart.chartType === 'bar').length}
              </div>
              <div className="text-sm text-blue-600">Bar Charts</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {charts.filter(chart => chart.chartType === 'line').length}
              </div>
              <div className="text-sm text-green-600">Line Charts</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {charts.filter(chart => chart.chartType === 'doughnut').length}
              </div>
              <div className="text-sm text-purple-600">Doughnut Charts</div>
            </div>
          </div>
        </div>
      )}

      <ChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => { setIsPreviewOpen(false); setPreviewChart(null); }}
        chartData={previewChart}
      />
    </div>
  );
}