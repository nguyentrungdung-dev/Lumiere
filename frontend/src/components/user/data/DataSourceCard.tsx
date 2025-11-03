import React from 'react';
import type { DataSource } from '../../../types';

interface DataSourceCardProps {
  dataSource: DataSource;
  onPreview: (dataSource: DataSource) => void;
  onEdit: (dataSource: DataSource) => void;
  onDelete: (dataSource: DataSource) => void;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({
  dataSource,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'excel':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{getTypeIcon(dataSource.source_type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{dataSource.name}</h3>
              {dataSource.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{dataSource.description}</p>
              )}
            </div>
          </div>
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${dataSource.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            `}
          >
            {dataSource.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Rows:</span>
            <span className="ml-2 font-medium text-gray-900">
              {dataSource.row_count?.toLocaleString() || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Columns:</span>
            <span className="ml-2 font-medium text-gray-900">
              {dataSource.column_count || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Size:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatFileSize(dataSource.file_size)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 font-medium text-gray-900 uppercase">
              {dataSource.source_type}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created {formatDate(dataSource.created_at)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onPreview(dataSource)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Preview
            </button>
            <button
              onClick={() => onEdit(dataSource)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(dataSource)}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

