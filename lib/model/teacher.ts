import { Paginator, ResponseWithPaginator } from './api';
import { CourseShort } from './course';

export interface Teacher {
  id: number;
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  courseAmount: number;
  profileId: number;
  email: string;
  ctime: string;
  updateAt: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface TeachersRequest extends Partial<Paginator> {
  query?: string;
}

export interface TeachersResponse {
  total: number;
  teachers: Teacher[];
  paginator?: ResponseWithPaginator;
}

export interface TeacherProfile<T = CourseShort> {
  id: number;
  address: string[];
  gender: number;
  birthday: string;
  avatar: string;
  description: string;
  workExperience: WorkExperience[];
  education: Education[];
  courses: T[];
}

export interface TeacherResponse extends Teacher{ 
  profile: TeacherProfile;
}

export interface Education {
  level: string;
  degree: string;
  startEnd: string;
}

export interface WorkExperience {
  company: string;
  post: string;
  startEnd: string;
}
