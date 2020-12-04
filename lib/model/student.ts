import { Paginator, ResponseWithPaginator } from './api';

export interface StudentCourse {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  updateAt: string;
  area: string;
  ctime: string;
  email: string;
  courses: StudentCourse[];
}

export interface StudentsRequest extends Partial<Paginator> {
  query?: string;
}

export interface StudentsResponse {
  students: Student[];
  total: number;
  paginator?: ResponseWithPaginator;
}

export interface AddStudentRequest {
  name: string;
  address: string;
  email: string;
  type: number;
}

export type AddStudentResponse = Student;

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export type UpdateStudentResponse = Student;
