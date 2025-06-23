import { Navigate, Outlet, useLocation } from 'react-router-dom';

const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

const AuthGuard = () => {
    const location = useLocation();

    return isAuthenticated() ? (
        <Outlet />
    ) : (
        <Navigate to="/authentication/Login" state={{ from: location }} replace />
    );
};

export default AuthGuard;
