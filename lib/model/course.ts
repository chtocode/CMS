import { Paginator } from './api';

export interface CourseShort {
  id: number;
  name: string;
}

type DurationUnit = 1 | 2 | 3 | 4 | 5;

export interface Course {
  id: number;
  name: string;
  uid: string;
  detail: string;
  startTime: string;
  classTime: string[];
  price: number;
  maxStudents: number;
  payStudents: number;
  star: number;
  status: number;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacher: number;
  typeId: number;
  ctime: string;
}

export type CourseRequest = Paginator;

export interface CourseResponse {
  total: number;
  courses: Course[];
}
  