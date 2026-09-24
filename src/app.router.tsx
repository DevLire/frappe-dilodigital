import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { Suspense } from 'react';

// Layouts
import AppLayout from '@/layout/AppLayout';

// Components
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import Home from '@/pages/dashboard/Home';
import LoginPage from '@/pages/auth/LoginPage.tsx';
import SignUp from '@/pages/auth/SignUp';
import UserProfiles from '@/pages/profile/UserProfiles.tsx';
import Calendar from '@/pages/Calendar';
import Blank from '@/pages/Blank';
import FormElements from '@/pages/forms/FormElements';
import BasicTables from '@/pages/tables/BasicTables';
import NotFound from '@/pages/otherPage/NotFound';

// UI
import Alerts from '@/pages/ui/Alerts';
import Avatars from '@/pages/ui/Avatars';
import Badges from '@/pages/ui/Badges';
import Buttons from '@/pages/ui/Buttons';
import Images from '@/pages/ui/Images';
import Videos from '@/pages/ui/Videos';
import LineChart from '@/pages/charts/LineChart';
import BarChart from '@/pages/charts/BarChart';

// Protected Routes
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from '@/components/routes/ProtectedRoutes';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthenticatedRoute>
        <ScrollToTop />
        <AppLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'profile',
        element: <UserProfiles />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'blank',
        element: <Blank />,
      },
      {
        path: 'form-elements',
        element: <FormElements />,
      },
      {
        path: 'basic-tables',
        element: <BasicTables />,
      },
      {
        path: 'ui/alerts',
        element: <Alerts />,
      },
      {
        path: 'ui/avatars',
        element: <Avatars />,
      },
      {
        path: 'ui/badge',
        element: <Badges />,
      },
      {
        path: 'ui/buttons',
        element: <Buttons />,
      },
      {
        path: 'ui/images',
        element: <Images />,
      },
      {
        path: 'ui/videos',
        element: <Videos />,
      },
      {
        path: 'charts/line-chart',
        element: <LineChart />,
      },
      {
        path: 'charts/bar-chart',
        element: <BarChart />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <NotAuthenticatedRoute>
        <Suspense fallback={<div>Cargando...</div>}>
          <Outlet />
        </Suspense>
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={'/auth/signin'} />,
      },
      {
        path: 'signin',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
