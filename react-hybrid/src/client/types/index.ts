export type InferGetServerDataType<T extends (args: any) => any> = Awaited<
  ReturnType<T>
>;
