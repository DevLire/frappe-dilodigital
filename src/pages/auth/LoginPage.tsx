import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import LoginForm from './components/LoginForm.tsx';

export default function LoginPage() {
  return (
    <>
      <PageMeta
        title="Iniciar sesión"
        description="This is React.js LoginPage Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
}
