import { frappeApi } from '@/api/frappeApi.ts';
import type { UserResponse } from '@/infrastructure/interfaces/frappe-user.response.ts';
import { UserMapper } from '@/infrastructure/mappers/user.mapper.ts';
import type { User } from '@/infrastructure/core/user.interface.ts';

export const getCurrentUserAction = async (): Promise<User | null> => {
  try {
    const res = await frappeApi.get('/api/method/frappe.auth.get_logged_user');
    const { data: loggedUserdata } = res;

    // Si devuelve 'Guest' o no hay email, no está autenticado
    if (!loggedUserdata.message || loggedUserdata.message === 'Guest') {
      return null;
    }

    const { data } = await frappeApi.get<UserResponse>(
      `/api/resource/User/${loggedUserdata.message}`
    );

    const user = UserMapper.frappeToEntity(data);

    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return null;
  }
};
