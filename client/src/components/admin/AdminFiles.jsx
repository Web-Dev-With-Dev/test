import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { useSocket } from '../../context/SocketContext';
import { getFiles, downloadFile, deleteFile } from '../../services/adminApi';

export default function AdminFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { socket, connected } = useSocket();

  useEffect(() => {
    console.log('🔄 AdminFiles mounted - initial data fetch');
    fetchFiles();
    
    // Set up auto-refresh every 30 seconds as fallback
    const intervalId = setInterval(() => {
      if (!connected) {
        console.log('⏱️ Auto-refresh interval triggered for files (socket disconnected)');
        fetchFiles();
      }
    }, 30000); // 30 seconds interval
    
    // Clean up interval on component unmount
    return () => {
      console.log('🧹 Cleaning up files refresh interval');
      clearInterval(intervalId);
    };
  }, [connected]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for file updates
    socket.on('file-update', ({ action, data }) => {
      console.log(`🔄 Real-time file ${action} received:`, data);
      
      if (action === 'create') {
        setFiles(prevFiles => [data, ...prevFiles]);
      } else if (action === 'update') {
        setFiles(prevFiles => 
          prevFiles.map(file => file._id === data._id ? data : file)
        );
      } else if (action === 'delete') {
        setFiles(prevFiles => 
          prevFiles.filter(file => file._id !== data._id)
        );
      }
    });
    
    return () => {
      socket.off('file-update');
    };
  }, [socket]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await getFiles();
      setFiles(response.data);
      console.log('✅ Files data fetched successfully:', response.data.length);
    } catch (error) {
      console.error('Error fetching files:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId, filename) => {
    try {
      // Replace direct axios call with the imported downloadFile function
      const response = await downloadFile(fileId);
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      // Replace direct axios call with the imported deleteFile function
      await deleteFile(fileId);
      
      setFiles(files.filter(file => file._id !== fileId));
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploadedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Uploaded Files</h1>
        <div className="mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{file.filename}</div>
                        <div className="text-sm text-gray-500">{file.originalName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{file.uploadedBy?.email || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{file.uploadedBy?.name || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(file.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadFile(file._id, file.filename)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file._id)}
                        className="text-red-600 hover:text-red-900 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm ? 'No files found matching your search.' : 'No files uploaded yet.'}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{files.length}</div>
            <div className="text-sm text-indigo-600">Total Files</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
            </div>
            <div className="text-sm text-green-600">Total Size</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(files.map(file => file.uploadedBy?.email)).size}
            </div>
            <div className="text-sm text-blue-600">Unique Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}