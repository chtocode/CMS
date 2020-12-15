import { Paginator } from './api';

export interface CourseShort {
  id: number;
  name: string;
}

type DurationUnit = 1 | 2 | 3 | 4 | 5;

type CourseStatus = 0 | 1 | 2;

export interface Course {
  id: number;
  name: string;
  uid: string; //code
  detail: string;
  startTime: string;
  price: number;
  maxStudents: number;
  star: CourseStatus;
  status: number;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacherName: string;
  teacherId: number;
  typeName: string;
  typeId: number;
  ctime: string;
  processId: number;
}

export interface CourseRequest extends Paginator {
  code?: string;
  name?: string;
  type?: number;
}

export interface CourseResponse {
  total: number;
  courses: Course[];
}

interface Sales {
  id: number;
  batches: number;
  price: number;
  earnings: number;
  paidAmount: number;
  studentAmount: number;
  paidIds: number[];
}

export interface Process {
  id: number;
  status: number;
  current: number;
  chapters: Chapter[];
  classTime: string[];
}

export interface Chapter {
  name: string;
  id: number;
  content: string;
}

export interface CourseDetail extends Course {
  sales: Sales;
  process: Process;
}

export type CourseDetailResponse = CourseDetail;

export interface CourseType {
  id: number;
  name: string;
}

export type AddCourseRequest = Pick<
  Course,
  | 'cover'
  | 'detail'
  | 'duration'
  | 'durationUnit'
  | 'maxStudents'
  | 'name'
  | 'price'
  | 'startTime'
  | 'uid'
> & { type: number; teacherId: number };

export type AddCourseResponse = Course;

export interface UpdateCourseRequest {
  id: number;
}

export type UpdateCourseResponse = Course;

export interface ProcessRequest {
  processId?: number;
  courseId?: number;
  chapters: Omit<Chapter, 'id'>[];
  classTime: string[];
}
