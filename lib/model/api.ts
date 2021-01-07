export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface QueryParams {
  [key: string]: string | number;
}

export interface Paginator {
  page: number; // start: 1;
  limit: number;
  total?: number;
}

export type RequestOmitPaginator<T> = Omit<T, 'page' | 'limit'>;
export interface DeleteRequest {
  id: number;
}

export type DeleteResponse = boolean;
export interface ListResponse {
  total: number;
  paginator?: Paginator;
}
