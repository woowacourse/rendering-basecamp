export async function fetchApi<T>(
  callback: Promise<{ data: T }>
): Promise<{ data: T; error: null } | { data: null; error: Error }> {
  try {
    const response = await callback;
    return { data: response.data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error };
    } else {
      console.error(error);
      return {
        data: null,
        error: new Error("뭔가 잘못됬는데요, 관리자한테 문의해보실래요?"),
      };
    }
  }
}
