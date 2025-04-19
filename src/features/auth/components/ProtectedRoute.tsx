import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';

export default function ProtectedRoute() {
  const { currentUser, loading } = useFirebase();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page with the return url
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}
