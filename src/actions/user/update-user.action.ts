import { frappeApi } from '@/api/frappeApi.ts';

export const updateUserAction = async (
  docname: string,
  dataToUpdate: Record<string, unknown>
): Promise<void> => {
  try {
    await frappeApi.put(`/api/resource/User/${docname}`, dataToUpdate);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};
