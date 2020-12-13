import { Paginator, ResponseWithPaginator } from './api';

export interface Teacher {
  id: number;
  name: string;
}

export interface TeachersRequest extends Partial<Paginator> {
  query?: string;
}

export interface TeachersResponse {
  total: number;
  teachers: Teacher[];
  paginator?: ResponseWithPaginator;
}
