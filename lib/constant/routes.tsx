import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  ProjectOutlined,
  ReadOutlined,
  SelectOutlined,
  SolutionOutlined,
  TeamOutlined,
  UpOutlined
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
  label: 'Student',
  icon: <SolutionOutlined />,
  subNav: [
    { path: [RoutePath.students], label: 'Student List', icon: <TeamOutlined /> },
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
  label: 'Course',
  icon: <ReadOutlined />,
  subNav: [
    { path: [RoutePath.courses], label: 'All Courses', icon: <ProjectOutlined /> },
    { path: [RoutePath.addCourse], label: 'Add Course', icon: <FileAddOutlined /> },
    { path: [RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined /> },
  ],
};

const teachers: SideNav = {
  path: [],
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  subNav: [
    {
      path: [RoutePath.teachers],
      label: 'Teacher List',
      icon: <TeamOutlined />,
    },
  ],
};

const overview: SideNav = {
  path: [],
  label: 'Overview',
  icon: <DashboardOutlined />,
};

export const routes: Map<Role, SideNav[]> = new Map([
  [Roles.manager, [overview, students, teachers, courses]],
  [Roles.teacher, [overview, students, courses]],
  [Roles.student, [overview, courses]],
]);
