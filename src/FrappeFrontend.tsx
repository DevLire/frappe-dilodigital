import { FrappeProvider } from 'frappe-react-sdk';
import { ThemeProvider } from '@/context/ThemeContext.tsx';
import { AppWrapper } from '@/components/common/PageMeta.tsx';
import { RouterProvider } from 'react-router';
import { appRouter } from '@/app.router.tsx';
import { useAuthStore } from '@/stores/pages/auth/useAuthStore.ts';
import { type PropsWithChildren, useEffect } from 'react';
import { useQuery, QueryClientProvider } from '@tanstack/react-query';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading.tsx';
import { queryClient } from '@/queryClient.ts';
import { getCurrentUserAction } from '@/actions/user/get-current-user.action.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: getCurrentUserAction,
    retry: false,
    refetchInterval: 1000 * 5, // 5 minutos
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user) {
        setAuth(null);
      } else {
        setAuth(user);
      }
    }
  }, [user, isError, isLoading, setAuth]);

  if (isLoading) return <CustomFullScreenLoading />;

  return <>{children}</>;
};

export default function FrappeFrontend() {
  return (
    <QueryClientProvider client={queryClient}>
      <FrappeProvider url={import.meta.env.VITE_API_URL} enableSocket={false}>
        <ThemeProvider>
          <AppWrapper>
            <CheckAuthProvider>
              <RouterProvider router={appRouter} />
            </CheckAuthProvider>
          </AppWrapper>
        </ThemeProvider>
      </FrappeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
