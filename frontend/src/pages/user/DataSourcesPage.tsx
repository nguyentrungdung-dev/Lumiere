import React, { useEffect, useState } from 'react';
import { FileUpload } from '../../components/user/data/FileUpload';
import { DataSourceCard } from '../../components/user/data/DataSourceCard';
import { DataPreviewModal } from '../../components/user/data/DataPreviewModal';
import { dataSourceApi } from '../../services/dataApi';
import type { DataSource, DataSourceUpdate } from '../../types';

export const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);
  const [previewDataSource, setPreviewDataSource] = useState<DataSource | null>(null);
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', is_active: true });

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await dataSourceApi.getDataSources();
      setDataSources(response.data_sources);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load data sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File, name: string) => {
    setIsUploading(true);
    setError('');
    try {
      await dataSourceApi.uploadCSV(file, name);
      await loadDataSources();
      setShowUpload(false);
    } catch (err: any) {
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (dataSource: DataSource) => {
    setEditingDataSource(dataSource);
    setEditForm({
      name: dataSource.name,
      description: dataSource.description || '',
      is_active: dataSource.is_active,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingDataSource) return;
    
    try {
      const updates: DataSourceUpdate = {};
      if (editForm.name !== editingDataSource.name) updates.name = editForm.name;
      if (editForm.description !== editingDataSource.description) updates.description = editForm.description;
      if (editForm.is_active !== editingDataSource.is_active) updates.is_active = editForm.is_active;

      await dataSourceApi.updateDataSource(editingDataSource.id, updates);
      await loadDataSources();
      setEditingDataSource(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update data source');
    }
  };

  const handleDelete = async (dataSource: DataSource) => {
    if (!confirm(`Are you sure you want to delete "${dataSource.name}"?`)) return;

    try {
      await dataSourceApi.deleteDataSource(dataSource.id);
      await loadDataSources();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete data source');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Sources</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload and manage your CSV data files
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {showUpload ? 'Cancel Upload' : '+ Upload Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Data Source</h2>
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>
      )}

      {/* Stats */}
      {!isLoading && dataSources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sources</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dataSources.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {dataSources.reduce((sum, ds) => sum + (ds.row_count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sources</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {dataSources.filter((ds) => ds.is_active).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : dataSources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data sources</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading a CSV file.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((dataSource) => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              onPreview={setPreviewDataSource}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewDataSource && (
        <DataPreviewModal
          dataSource={previewDataSource}
          onClose={() => setPreviewDataSource(null)}
        />
      )}

      {/* Edit Modal */}
      {editingDataSource && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setEditingDataSource(null)}
            />
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit Data Source</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingDataSource(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

