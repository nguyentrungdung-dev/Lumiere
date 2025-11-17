import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { UserTable } from '../../components/admin/users/UserTable';
import { UserDetailsModal } from '../../components/admin/users/UserDetailsModal';
import { adminUserApi } from '../../services/adminApi';
import type { UserListItem, UserDetailResponse } from '../../types';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>('');
  const pageSize = 20;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setError('');
    try {
      const response = await adminUserApi.getUsers(
        currentPage,
        pageSize,
        searchQuery || undefined
      );
      setUsers(response.users);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleViewDetails = async (user: UserListItem) => {
    setIsLoadingDetails(true);
    try {
      const details = await adminUserApi.getUserDetails(user.id);
      setSelectedUser(details);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load user details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    if (!confirm(`Are you sure you want to ${isActive ? 'enable' : 'disable'} this user?`)) {
      return;
    }

    try {
      await adminUserApi.updateUserStatus(userId, { is_active: isActive });
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminUserApi.deleteUser(userId);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage all platform users
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* User Table */}
        <UserTable
          users={users}
          isLoading={isLoadingUsers}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {(selectedUser || isLoadingDetails) && (
          <UserDetailsModal
            user={selectedUser}
            isLoading={isLoadingDetails}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;

