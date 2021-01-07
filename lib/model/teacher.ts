import { ListResponse, Paginator } from './api';
import { Course } from './course';

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

export interface TeachersResponse extends ListResponse {
  teachers: Teacher[];
}
export interface TeacherProfile {
  id: number;
  address: string[];
  gender: number;
  birthday: string;
  avatar: string;
  description: string;
  workExperience: WorkExperience[];
  education: Education[];
}

export interface TeacherResponse extends Teacher {
  profile: TeacherProfile;
  courses?: Course[];
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

export interface AddTeacherRequest {
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  email: string;
}

export type AddTeacherResponse = Teacher;

export interface UpdateTeacherRequest extends AddTeacherRequest {
  id: number;
}

export type UpdateTeacherResponse = Teacher;
