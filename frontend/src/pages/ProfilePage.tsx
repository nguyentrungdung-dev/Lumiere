import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Profile Page
            </h1>
            <p className="text-gray-600">
              User: {user?.username}
            </p>
            <p className="text-gray-600">
              Email: {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

