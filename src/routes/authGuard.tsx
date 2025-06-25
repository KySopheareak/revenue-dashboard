import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from 'services/authentication.service';

const AuthGuard = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);
        };

        checkAuth();
    }, [location]); // Re-check when location changes

    // Show loading while checking
    if (isAuthenticated === null) {
        return <div>Checking authentication...</div>;
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/authentication/Login" state={{ from: location }} replace />;
};

export default AuthGuard;