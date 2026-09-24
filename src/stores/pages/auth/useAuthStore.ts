import { create } from 'zustand';
import type { User } from '@/infrastructure/core/user.interface.ts';
import { loginAction, logoutAction } from '@/actions/auth';
import { getCurrentUserAction } from '@/actions/user/get-current-user.action.ts';

interface AuthState {
  // States
  status: 'checking' | 'authenticated' | 'unauthenticated';
  user: User | null;
  isLoading: boolean;
  lastAuthCheck: number | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: (logoutFn: () => Promise<void>) => Promise<void>;

  // Methods
  setAuth: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'checking',
  user: null,
  isLoading: false,
  lastAuthCheck: null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await loginAction(email, password);
      const user = await getCurrentUserAction();
      if (user) {
        set({ user: user, status: 'authenticated', lastAuthCheck: Date.now() });
        return true;
      }
      set({ user: null, status: 'unauthenticated' });
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ user: null, status: 'unauthenticated' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async (logoutFn) => {
    set({ isLoading: true });
    try {
      await logoutAction(logoutFn);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    } finally {
      set({
        isLoading: false,
        user: null,
        status: 'unauthenticated',
        lastAuthCheck: null,
      });
    }
  },

  setAuth: (user: User | null) => {
    if (user) {
      set({ user, status: 'authenticated', isLoading: false });
    } else {
      set({ user: null, status: 'unauthenticated', isLoading: false });
    }
  },
}));
