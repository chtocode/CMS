import {
  AlibabaOutlined,
  FileOutlined,
  PlayCircleOutlined,
  SelectOutlined,
  TeamOutlined,
  UpOutlined,
  UserOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import React from 'react';
import { Role } from '../model';
import { Role as Roles } from './role';
/**
 * router path
 */
export enum RoutePath {
  manager = 'manager',
  teachers = 'teachers',
  students = 'students',
  selectStudents = 'selectStudents',
  courses = 'courses',
}

export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string[];
  selected?: boolean;
  subNav?: SideNav[];
  hide?: boolean;
}

const students: SideNav = {
  path: [],
  label: 'Students',
  icon: <YoutubeOutlined />,
  subNav: [
    { path: [RoutePath.students], label: 'Student List', icon: <UserOutlined /> },
    {
      path: [RoutePath.selectStudents],
      label: 'Select Students',
      icon: <SelectOutlined />,
      subNav: [{ path: ['aa'], label: 'Test', icon: <UpOutlined /> }],
    },
  ],
};

const courses: SideNav = {
  path: [RoutePath.courses],
  label: 'Courses',
  icon: <FileOutlined />,
};

const teachers: SideNav = {
  path: [],
  label: 'Teachers',
  icon: <AlibabaOutlined />,
  subNav: [
    {
      path: [RoutePath.teachers],
      label: 'Teacher List',
      icon: <TeamOutlined />,
      subNav: [{ path: ['bb'], label: 'Test', icon: <UpOutlined /> }],
    },
  ],
};

const overview: SideNav = {
  path: [],
  label: 'Overview',
  icon: <PlayCircleOutlined />,
};

export const routes: Map<Role, SideNav[]> = new Map([
  [Roles.manager, [overview, students, teachers, courses]],
  [Roles.teacher, [overview, students, courses]],
  [Roles.student, [overview, courses]],
]);