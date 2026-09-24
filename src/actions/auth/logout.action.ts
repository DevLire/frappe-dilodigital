export const logoutAction = async (logoutFn: () => Promise<void>) => {
  try {
    await logoutFn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    /* empty */
  }
};
