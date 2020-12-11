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
  uid: string;
  detail: string;
  startTime: string;
  price: number;
  maxStudents: number;
  star: CourseStatus;
  status: number;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacher: number;
  typeName: string;
  ctime: string;
}

export type CourseRequest = Paginator;

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
