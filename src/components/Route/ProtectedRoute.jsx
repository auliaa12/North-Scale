import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, admin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (requiredRole === 'admin') {
        if (!admin) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return children;
    }

    if (requiredRole === 'user') {
        if (!user) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        return children;
    }

    // Default fallback
    if (!user && !admin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
