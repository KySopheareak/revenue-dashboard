import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../../services/authentication.service';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('message');
        AuthService.handleAuthCallback(token, error, navigate);
        setIsProcessing(false);
    }, [navigate, searchParams]);

    if (isProcessing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Processing login...</p>
                </div>
            </div>
        );
    }

    return null;
};

export default AuthCallback;