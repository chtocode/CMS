import {
  AlibabaOutlined,
  CaretUpOutlined,

  EditOutlined,

  FileOutlined,
  PlayCircleOutlined,
  SelectOutlined,
  TeamOutlined,
  UpOutlined,
  UserAddOutlined,
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
  addCourse = 'add-course',
  editCourse = 'edit-course',
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
  path: [],
  label: 'Courses',
  icon: <FileOutlined />,
  subNav: [
    { path: [RoutePath.courses], label: 'All Courses', icon: <CaretUpOutlined /> },
    { path: [RoutePath.addCourse], label: 'Add Course', icon: <UserAddOutlined /> },
    { path: [RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined /> },
  ],
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
