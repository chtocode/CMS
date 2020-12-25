import {
  CalendarOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined
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
  own = 'own',
  schedule = 'schedule',
}

export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string[];
  hideLinkInBreadcrumb?: boolean; // 当前面包屑上的链接是否应该被隐藏
  subNav?: SideNav[];
}

const students: SideNav = {
  path: [RoutePath.students],
  label: 'Student',
  icon: <SolutionOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [{ path: [''], label: 'Student List', icon: <TeamOutlined /> }],
};

const courses: SideNav = {
  path: [RoutePath.courses],
  label: 'Course',
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    { path: [RoutePath.addCourse], label: 'Add Course', icon: <FileAddOutlined /> },
    { path: [RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined /> },
  ],
};

const teachers: SideNav = {
  path: [RoutePath.teachers],
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    {
      path: [''],
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

const studentCourses: SideNav = {
  path: [RoutePath.courses],
  label: 'Course',
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    { path: [RoutePath.own], label: 'My Courses', icon: <FileAddOutlined /> },
  ],
};

const classSchedule: SideNav = { 
  path: [RoutePath.schedule],
  label: 'Class Schedule',
  icon: <CalendarOutlined />
}

export const routes: Map<Role, SideNav[]> = new Map([
  [Roles.manager, [overview, students, teachers, courses]],
  [Roles.teacher, [overview, students, courses]],
  [Roles.student, [overview, studentCourses, classSchedule]],
]);
