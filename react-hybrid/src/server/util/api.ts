export type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export async function fetchApi<T>(
  callback: Promise<{ data: T }>
): Promise<ApiResult<T>> {
  try {
    const response = await callback;
    return { status: "success", data: response.data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: "error", error };
    } else {
      console.error(error);
      return {
        status: "error",
        error: new Error("뭔가 잘못됬는데요, 관리자한테 문의해보실래요?"),
      };
    }
  }
}
