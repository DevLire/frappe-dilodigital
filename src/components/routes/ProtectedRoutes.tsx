import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/pages/auth/useAuthStore';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading.tsx';

// 1. Solo usuarios logueados
export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const status = useAuthStore((state) => state.status);

  if (status === 'checking') return <CustomFullScreenLoading />;

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

// 2. Solo usuarios NO logueados (para Signin/Signup)
export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const status = useAuthStore((state) => state.status);

  if (status === 'checking') return null;

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 3. Ruta protegida por Rol específico (ej. System Manager o Académico)
export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: PropsWithChildren<{ allowedRoles: string[] }>) => {
  const { status, user } = useAuthStore();

  if (status === 'checking') return null;

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/signin" replace />;
  }

  // Verificamos si el usuario tiene al menos uno de los roles permitidos
  const hasAccess = user?.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};
