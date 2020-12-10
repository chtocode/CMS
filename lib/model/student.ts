import { Paginator, ResponseWithPaginator } from './api';
import { Course, CourseShort } from './course';

export interface Student<T = CourseShort> {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  updateAt: string;
  area: string;
  ctime: string;
  email: string;
  courses: T[];
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

export interface StudentRequest {
  id: number;
}

export type StudentResponse = StudentProfile;
export interface StudentProfile extends Student<Course> {
  address: string;
  phone: number;
  gender: number;
  education: string;
  age: number;
  interest: string[];
  avatar: string;
  memberStartAt: string;
  memberEndAt: string;
  description: string;
}
