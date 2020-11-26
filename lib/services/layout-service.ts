import { ParsedUrlQuery } from 'querystring';

const AppMenuKeys = {
  homeSubMenu: 'home',
  dashBoard: '/home',
  studentSubMenu: 'students',
  studentList: '/students',
  editStudent: '/students/edit-student',
  studentSelection: '/students/selections',
  courseSubMenu: 'course',
  courseList: '/course',
  editCourse: '/course/edit-course',
  courseType: '/course/course-type',
  teacherSubMenu: 'teacher',
  teacherList: '/teacher',
  managerSubMenu: 'manager',
  managerList: '/manager',
  roleSubMenu: 'role',
  roleList: '/role',
  settingSubMenu: 'settings',
  settingPassword: '/settings',
};

const getSecondaryPathByString = (string) => {
  return string.split('/').pop();
};

export const getBreadcrumb = (path: string, query: ParsedUrlQuery): string => {
  const { id } = query;
  const secondaryPath = path.split('/')[2];

  // 通过路由匹配指定的左侧的导航条显示内容
  if (secondaryPath === getSecondaryPathByString(AppMenuKeys.editCourse)) {
    return id ? '编辑课程' : '添加课程';
  } else if (secondaryPath === getSecondaryPathByString(AppMenuKeys.courseType)) {
    return '课程类型';
  } else if (secondaryPath === getSecondaryPathByString(AppMenuKeys.editStudent)) {
    return id ? '编辑学员' : '添加学员';
  } else if (secondaryPath === getSecondaryPathByString(AppMenuKeys.studentSelection)) {
    return '选择';
  }

  const currentPath = path.split('/')[1];

  switch (currentPath) {
    case AppMenuKeys.studentSubMenu:
      return '学生列表';
    case AppMenuKeys.courseSubMenu:
      return '课程列表';
    case AppMenuKeys.managerSubMenu:
      return '管理员们';
    case AppMenuKeys.roleSubMenu:
      return '角色列表';
    case AppMenuKeys.teacherSubMenu:
      return '教师列表';
    case AppMenuKeys.settingSubMenu:
      return '设置';
    case AppMenuKeys.homeSubMenu:
      return '主页';
  }
};
