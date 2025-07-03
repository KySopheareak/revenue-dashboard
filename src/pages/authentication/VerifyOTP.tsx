import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import AuthService from '../../services/authentication.service';
import { ResendOTP, VerifyOTPMail } from 'services/loginService.service';

interface VerifyOTPProps {
    email?: string;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ email }) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const email = searchParams.get('email') || '';
            const response = await VerifyOTPMail(email, otp);
            if (response) {
                const token = response.token;
                AuthService.handleAuthCallback(token, error, navigate);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const email = searchParams.get('email') || '';
            const response = await ResendOTP(email || '');

            if (response.ok) {
                alert('OTP resent successfully');
            } else {
                alert('Failed to resend OTP');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        }
    };

    return (
        <Box
            sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', py: 12, px: { xs: 4, sm: 6, lg: 8 } }}
        >
            <Box sx={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h2" sx={{ mt: 6, fontWeight: 800, color: '#111827' }}>
                        Verify OTP
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: '#6b7280' }}>
                        Enter the verification code sent to {email}
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        fullWidth
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        inputProps={{
                            maxLength: 6,
                            pattern: '[0-9]{6}'
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                '& fieldset': {
                                    borderColor: '#d1d5db'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#6366f1'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#6366f1'
                                }
                            }
                        }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        fullWidth
                        variant="contained"
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            borderRadius: 1,
                            backgroundColor: '#6366f1',
                            '&:hover': {
                                backgroundColor: '#4f46e5'
                            },
                            '&:disabled': {
                                opacity: 0.5,
                                cursor: 'not-allowed'
                            }
                        }}
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            type="button"
                            onClick={handleResendOTP}
                            variant="text"
                            sx={{
                                color: '#6366f1',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    color: '#4f46e5',
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            Didn't receive code? Resend OTP
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default VerifyOTP;