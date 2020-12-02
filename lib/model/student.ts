import { RequestWithPaginator, ResponseWithPaginator } from './api';

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
export interface StudentsRequest {
  query?: string;
  paginator?: RequestWithPaginator;
}

export interface StudentsResponse {
  students: Student[];
  paginator?: ResponseWithPaginator;
}
