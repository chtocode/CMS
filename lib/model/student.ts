import { ListResponse, Paginator } from './api';
import { Course, CourseShort } from './course';

export interface Student<T = CourseShort> {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  updateAt: string;
  country: string;
  ctime: string;
  email: string;
  courses: T[];
}

export interface StudentsRequest extends Paginator {
  query?: string;
  userId?: number;
}

export interface StudentsResponse extends ListResponse {
  students: Student[];
}
export interface AddStudentRequest {
  name: string;
  country: string;
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

export type StudentResponse = StudentWithProfile;

export interface StudentWithProfile extends Student<Course>, StudentProfile {}

export interface StudentProfile {
  name: string;
  country: string;
  email: string;
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
