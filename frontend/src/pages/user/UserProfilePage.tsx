import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import UserLayout from '../../components/user/layout/UserLayout';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';

// Profile update schema
const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email format'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Password change schema
const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (_data: ProfileFormData) => {
    console.log('Update profile');
    // TODO: Implement profile update
    setIsEditingProfile(false);
  };

  const onSubmitPassword = async (_data: PasswordFormData) => {
    console.log('Change password');
    // TODO: Implement password change
    resetPasswordForm();
    setIsChangingPassword(false);
  };

  return (
    <UserLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <Avatar
                name={user?.full_name || user?.username || 'User'}
                src={user?.avatar_url || undefined}
                size="xl"
                status="online"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.full_name || user?.username}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Joined {new Date(user?.created_at || '').toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => console.log('Upload avatar')}
              >
                Change Avatar
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            {!isEditingProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={profileErrors.full_name?.message}
                {...registerProfile('full_name')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={profileErrors.email?.message}
                {...registerProfile('email')}
              />
              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Username</label>
                <p className="mt-1 text-base text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-base text-gray-900">{user?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-base text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Locale</label>
                <p className="mt-1 text-base text-gray-900">{user?.locale || 'en-US'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Security Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <PasswordInput
                label="Current Password"
                placeholder="Enter current password"
                error={passwordErrors.current_password?.message}
                {...registerPassword('current_password')}
              />
              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                error={passwordErrors.new_password?.message}
                {...registerPassword('new_password')}
              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm new password"
                error={passwordErrors.confirm_password?.message}
                {...registerPassword('confirm_password')}
              />
              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    resetPasswordForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Password last changed {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'never'}
              </div>
            </div>
          )}
        </Card>

        {/* Account Activity Card */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Last Login</p>
                <p className="text-xs text-gray-500">
                  {user?.last_login_at
                    ? new Date(user.last_login_at).toLocaleString()
                    : 'No login recorded'}
                </p>
              </div>
              <span className="text-xs text-gray-500">Just now</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                <p className="text-xs text-gray-500">Changed email address</p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-xs text-gray-500">Welcome to Lumiere!</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Delete Account</p>
                <p className="text-xs text-gray-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => console.log('Delete account')}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;
