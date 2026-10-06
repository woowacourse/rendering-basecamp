export interface QueryError {
  message: string;
  status: number;
}

export type QueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: QueryError };
