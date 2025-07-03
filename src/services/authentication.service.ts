import paths from "routes/paths";

class AuthService {
    private static instance: AuthService;
    private tokenExpiryTimer: number | null = null;
    private constructor() {
        this.checkTokenOnLoad();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    handleAuthCallback(token: string | null, error: string | null, navigate?: (path: string) => void): boolean {
        try {
            if (error) {
                console.error('Auth callback error:', error);
                if (navigate) {
                    navigate('/authentication/Login?error=' + encodeURIComponent(error));
                }
                return false;
            }

            if (!token) {
                console.error('No token received in callback');
                if (navigate) {
                    navigate('/authentication/Login?error=No token received');
                }
                return false;
            }

            // Decode JWT token
            const payload = JSON.parse(atob(token.split('.')[1]));
            const responseData = {
                token: token,
                expireTime: payload.exp,
                user: {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email
                }
            };

            this.handleLoginSuccess(responseData, navigate);
            return true;

        } catch (error) {
            console.error('Error processing auth callback:', error);
            if (navigate) {
                navigate('/authentication/Login?error=Invalid token');
            }
            return false;
        }
    }

    // Handle login response
    handleLoginSuccess(responseData: {
        token: string;
        expireTime: number;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }, navigate?: (path: string) => void) {
        const authData = {
            token: responseData.token,
            expireTime: responseData.expireTime,
            user: responseData.user
        };
        localStorage.setItem('authData', JSON.stringify(authData));
        this.scheduleTokenExpiry();
        if (navigate) {
            console.log(`AuthService: Navigating to ${paths.dashboard}`);

            navigate(paths.dashboard);
        }

        return authData;
    }

    // Check if token is valid
    isTokenValid(): boolean {
        const authData = localStorage.getItem('authData');
        if (!authData) return false;

        try {
            const parsedData = JSON.parse(authData);
            const currentTime = Math.floor(Date.now() / 1000);

            return currentTime < parsedData.expireTime;
        } catch (error) {
            return false;
        }
    }

    // Get valid token
    getToken(): string | null {
        if (!this.isTokenValid()) {
            this.logout();
            return null;
        }

        const authData = localStorage.getItem('authData');
        if (!authData) return null;

        try {
            const parsedData = JSON.parse(authData);
            return parsedData.token;
        } catch (error) {
            return null;
        }
    }

    // Get current user
    getCurrentUser(): { id: string; username: string; email: string } | null {
        if (!this.isTokenValid()) {
            this.logout();
            return null;
        }

        const authData = localStorage.getItem('authData');
        if (!authData) return null;

        try {
            const parsedData = JSON.parse(authData);
            return parsedData.user;
        } catch (error) {
            return null;
        }
    }

    // Schedule automatic logout when token expires
    private scheduleTokenExpiry(): void {
        const authData = localStorage.getItem('authData');
        if (!authData) return;

        try {
            const parsedData = JSON.parse(authData);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = (parsedData.expireTime - currentTime) * 1000;
            console.log(`Scheduling token expiry in ${Math.floor(timeUntilExpiry / 60000)} minutes`);

            if (this.tokenExpiryTimer) {
                clearTimeout(this.tokenExpiryTimer);
            }

            if (timeUntilExpiry > 0) {
                this.tokenExpiryTimer = setTimeout(() => {
                    this.logout();
                    // Optionally emit an event or show notification
                    console.log('Token expired, please login again');
                    window.location.href = '/authentication/Login';
                }, timeUntilExpiry);
            }
        } catch (error) {
            console.error('Error scheduling token expiry:', error);
        }
    }

    // Check token on page load/app initialization
    private checkTokenOnLoad(): void {
        if (!this.isTokenValid()) {
            this.logout();
        } else {
            this.scheduleTokenExpiry();
        }
    }

    // Logout function
    logout(): void {
        localStorage.removeItem('authData');
        if (this.tokenExpiryTimer) {
            clearTimeout(this.tokenExpiryTimer);
            this.tokenExpiryTimer = null;
        }
    }

    // Get time remaining until expiry (in minutes)
    getTimeUntilExpiry(): number {
        const authData = localStorage.getItem('authData');

        if (!authData) return 0;

        try {
            const parsedData = JSON.parse(authData);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeRemaining = parsedData.expireTime - currentTime;

            return Math.max(0, Math.floor(timeRemaining / 60));
        } catch (error) {
            return 0;
        }
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.isTokenValid();
    }

    loginWithGoogle(): void {
        window.location.href = 'http://localhost:5000/auth/google';
    }
}

export default AuthService.getInstance();