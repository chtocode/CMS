import { Paginator, ResponseWithPaginator } from './api';

export interface Student {
  id: number;
  name: string;
  type_id: number;
  course_id_deleted: number;
  update_date: string;
  password: string;
  address: string;
  ctime: string;
  email: string;
}

export interface StudentsRequest extends Partial<Paginator> {
  query?: string;
}

export interface StudentsResponse {
  students: Student[];
  total: number;
  paginator?: ResponseWithPaginator;
}
