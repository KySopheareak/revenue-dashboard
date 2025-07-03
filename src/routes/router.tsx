/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';
import Feature from 'pages/dashboard';
import User from 'pages/users';
import Integration from 'pages/integrations';
import Pricing from 'pages/pricing';
import AuthGuard from './authGuard';
import PageNotFound from 'pages/notFound';
// import AuthCallback from 'pages/authentication/VerfiyLogin';
import VerifyOTP from 'pages/authentication/VerifyOTP';
import AuthCallback from 'pages/authentication/VerfiyLogin';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));

const router = createBrowserRouter(
    [
        {
            element: (
                <Suspense fallback={<Splash />}>
                    <App />
                </Suspense>
            ),
            children: [
                {   
                    path: '/',
                    element: <Navigate to="/dashboard" replace />,
                },
                {
                    element: <AuthGuard />,
                    children: [
                        {
                            path: '/dashboard',
                            element: (
                                <MainLayout>
                                    <Suspense fallback={<PageLoader />}>
                                        <Outlet />
                                    </Suspense>
                                </MainLayout>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <Dashboard />,
                                },
                            ],
                        },
                        {
                            path: '/features',
                            element: (
                                <MainLayout>
                                    <Suspense fallback={<PageLoader />}>
                                        <Outlet />
                                    </Suspense>
                                </MainLayout>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <Feature />,
                                },
                            ],
                        },
                        {
                            path: '/users',
                            element: (
                                <MainLayout>
                                    <Suspense fallback={<PageLoader />}>
                                        <Outlet />
                                    </Suspense>
                                </MainLayout>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <User />,
                                },
                            ],
                        },
                        {
                            path: '/pricing',
                            element: (
                                <MainLayout>
                                    <Suspense fallback={<PageLoader />}>
                                        <Outlet />
                                    </Suspense>
                                </MainLayout>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <Pricing />,
                                },
                            ],
                        },
                        {
                            path: '/integrations',
                            element: (
                                <MainLayout>
                                    <Suspense fallback={<PageLoader />}>
                                        <Outlet />
                                    </Suspense>
                                </MainLayout>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <Integration />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: rootPaths.authRoot,
                    element: (
                        <AuthLayout>
                            <Outlet />
                        </AuthLayout>
                    ),
                    children: [
                        {
                            path: paths.login,
                            element: <Login />,
                        },
                        {
                            path: paths.signup,
                            element: <Signup />,
                        },
                        {
                            path: paths.verifyOTP,
                            element: <VerifyOTP />,
                        },
                        {
                            path: paths.verifyLogin,
                            element: <AuthCallback />,
                        }
                    ],
                },
            ],
        },
        {
            path: '*',
            element: <PageNotFound />,
        },
    ],
    {
        basename: '',
    },
);

export default router;
