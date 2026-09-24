import { frappeApi } from '@/api/frappeApi.ts';
import type { AuthResponse } from '@/infrastructure/interfaces/auth';

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await frappeApi.post<AuthResponse>('/api/method/login', {
    usr: email,
    pwd: password,
  });
  return data;
};

export const loginFn = loginAction;
