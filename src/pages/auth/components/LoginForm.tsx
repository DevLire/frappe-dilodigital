import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { EyeCloseIcon, EyeIcon } from '../../../icons';
import Label from '../../../components/form/Label.tsx';
import Input from '../../../components/form/input/InputField.tsx';
import Checkbox from '../../../components/form/input/Checkbox.tsx';
import Button from '../../../components/ui/button/Button.tsx';
import { cn } from '@/lib/utils.ts';
import { useAuthStore } from '@/stores/pages/auth/useAuthStore.ts';

export default function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const isValid = await login(email, password);

    if (isValid) {
      navigate('/');
      return;
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese su correo y contraseña para iniciar sesión
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"></div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      name="password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <Button
                    className={cn(
                      'w-full',
                      isLoading ?? 'bg-blue-900 cursor-not-allowed'
                    )}
                    size="sm"
                    disabled={isLoading}
                  >
                    <p className={cn(isLoading ? 'hidden' : 'visible')}>
                      Ingresar
                    </p>
                    <div
                      className={cn(
                        'h-4 w-4 animate-spin rounded-full border-4 border-primary border-t-transparent',
                        isLoading ? 'visible' : 'hidden'
                      )}
                    />
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
