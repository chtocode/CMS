import { Course, Schedule } from './course';
import { StudentProfile } from './student';
import { Teacher, TeacherProfile } from './teacher';

export interface BasicStatistics {
  total: number; //总数
  lastMonthAdded: number; //近一个月内加入的数量
}

export interface GenderStatistics extends BasicStatistics {
  gender: { male: number; female: number; unknown: number };
}

export type Statistic = { amount: number; name: string; [key: string]: any };

export type StatisticsType = 'student' | 'teacher' | 'course';

export interface StatisticsRequest<T> {
  type?: StatisticsType;
}

export type StatisticsResponse<T = any, U = Statistic> = {
  [key in keyof T]: U | U[] | Statistic | Statistic[];
};

export interface StatisticsOverviewResponse {
  course: BasicStatistics;
  student: GenderStatistics;
  teacher: GenderStatistics;
}

export type StudentStatistics = StatisticsResponse<StudentProfile>;

export type TeacherStatistics = StatisticsResponse<Teacher & TeacherProfile>;

export interface ClassTimeStatistic {
  name: string;
  typeName: string;
  classTime: string[];
}

export interface CourseClassTimeStatistic extends Statistic {
  courses: ClassTimeStatistic[];
}

export type CourseStatistics = StatisticsResponse<Course & Schedule, CourseClassTimeStatistic>;

export interface CommonChartComponentProps<T = Statistic> {
  data: T[];
  title?: string;
}
