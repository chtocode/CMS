import { Course } from './course';
import { StudentProfile } from './student';
import { TeacherProfile } from './teacher';

export interface BasicStatistics {
  total: number; //总数
  lastMonthAdded: number; //近一个月内加入的数量
}

export interface GenderStatistics extends BasicStatistics {
  gender: { male: number; female: number; unknown: number };
}

export type Statistic = { amount: number; name: string } | number;

export type StatisticsType = 'student' | 'teacher' | 'course';

export interface StatisticsRequest<T> {
  type?: StatisticsType;
  fields?: keyof T[];
}

export type StatisticsResponse<T = any> = {
  [key in keyof T]: Statistic | Statistic[];
};

export interface StatisticsOverviewResponse {
  course: BasicStatistics;
  student: GenderStatistics;
  teacher: GenderStatistics;
}

export type StudentStatistics = StatisticsResponse<StudentProfile>;

export type TeacherStatistics = StatisticsResponse<TeacherProfile>;

export type CourseStatistics = StatisticsResponse<Course>;

export interface CommonChartComponentProps {
  data: Exclude<Statistic, number>[];
}

/**
 * teacher
 * count by country  google map
 * skills  可以求出掌握某项技能的老师的数量，熟练度的最高值，平均值，最低值。
 * age: 年龄相关，平均年龄。
 * work experience: 工作经验区间，3年以下，3-5年，5-10年，10年以上等等
 */

/**
 * course
 * count by type 每种类型的课程数量
 * star
 * status
 * duration
 * class time  例如： 周一 共几节课，上课时间分布情况等。
 */
