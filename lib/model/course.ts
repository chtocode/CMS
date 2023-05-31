import { ListResponse, Paginator } from './api';

export interface CourseShort {
  id: number;
  name: string;
  courseId: number;
}

type DurationUnit = 1 | 2 | 3 | 4 | 5;

type CourseStatus = 0 | 1 | 2;

export interface CourseType {
  id: number;
  name: string;
}

export interface Course {
  cover: string;
  ctime: string;
  detail: string;
  duration: number;
  durationUnit: DurationUnit;
  id: number;
  maxStudents: number;
  name: string;
  price: number;
  scheduleId: number;
  star: number;
  startTime: string;
  status: CourseStatus;
  teacherId: number;
  teacherName: string;
  type: CourseType[];
  uid: string; //code
}

export interface CourseRequest extends Paginator {
  code?: string;
  name?: string;
  type?: number;
  userId?: number;
  own?: any; // ?这个字段是多余的，真实的后台可以根据token等鉴定用户权限
}

export interface CourseResponse extends ListResponse {
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

export interface Schedule {
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
  order: number;
}

export interface CourseDetail extends Course {
  sales: Sales;
  schedule: Schedule;
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
> & { type: number | number[]; teacherId: number };

export type AddCourseResponse = Course;

export interface UpdateCourseRequest {
  id: number;
}

export type UpdateCourseResponse = Course;

export interface ScheduleRequest {
  scheduleId?: number;
  courseId?: number;
  current?: number;
  statue?: number;
  chapters?: Omit<Chapter, 'id'>[];
  classTime?: string[];
}

export interface StudentCourse {
  id: number;
  studentId: number;
  ctime: string;
  courseDate: string;
  course: Course;
}

export interface StudentOwnCoursesResponse extends ListResponse {
  courses: StudentCourse[];
}

export interface ClassSchedule extends Course {
  schedule: Schedule;
}
