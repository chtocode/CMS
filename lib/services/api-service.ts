import { message } from 'antd';
import axios, { AxiosError } from 'axios';
import {
  AddStudentRequest,
  AddStudentResponse,
  AddTeacherRequest,
  AddTeacherResponse,
  LogoutRequest,
  LogoutResponse,
  Role,
  StudentResponse,
  StudentsRequest,
  StudentsResponse,
  TeacherResponse,
  TeachersRequest,
  TeachersResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
  UpdateTeacherRequest,
  UpdateTeacherResponse
} from '../model';
import { DeleteRequest, DeleteResponse, IResponse, QueryParams } from '../model/api';
import { Country, Degree } from '../model/common';
import {
  AddCourseRequest,
  AddCourseResponse,
  ClassSchedule,
  CourseDetailResponse,
  CourseRequest,
  CourseResponse,
  CourseType,
  Schedule,
  ScheduleRequest,
  UpdateCourseRequest,
  UpdateCourseResponse
} from '../model/course';
import { LoginRequest, LoginResponse } from '../model/login';
import {
  Statistic,
  StatisticsOverviewResponse,
  StatisticsResponse,
  StatisticsType
} from '../model/statistics';
import { RootPath, SubPath } from './api-path';
import storage from './storage';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
  responseType: 'json',
});

type IPath = string[] | string;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;

    return axiosInstance
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + storage?.token,
        },
      })
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params, {
        headers: {
          Authorization: 'Bearer ' + storage?.token,
        },
      })
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path), {
        params,
        headers: {
          Authorization: 'Bearer ' + storage?.token,
        },
      })
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  /**
   * 根据 HTTP 状态码判断请求是否成功
   */
  protected isError(code: number): boolean {
    return !(code.toString().startsWith('2') || code.toString().startsWith('3'));
  }

  /**
   * 显示 Api 上的提示信息
   */
  protected showMessage = (isSuccessDisplay = false) => (res: IResponse): IResponse => {
    const { code, msg } = res;
    const isError = this.isError(code);

    if (isError) {
      message.error(msg);
    }

    if (isSuccessDisplay && !isError) {
      message.success(msg);
    }

    return res;
  };

  /**
   * 处理 http 请求上的错误
   * 注意：此处返回的code是HTTP的状态码，并非后台自定义的code
   */
  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response.data.msg;
    const code = err.response.status;

    return { msg, code };
  }

  private getPath(path: string | string[]): string {
    return typeof path === 'string' ? path : path.join('/');
  }
}

class ApiService extends BaseApiService {
  /**
   * !FIXME: 加密码用户信息
   */
  login(req: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.get<IResponse<LoginResponse>>(RootPath.login, (req as unknown) as QueryParams).then(
      this.showMessage()
    );
  }

  /**
   * ? unused get user type by token
   */
  getUserType(token: string): Promise<IResponse<string>> {
    return this.get<IResponse<string>>(RootPath.userType, { token }).then(this.showMessage());
  }

  logout(req: LogoutRequest): Promise<IResponse<LogoutResponse>> {
    return this.post<IResponse<LogoutResponse>>(RootPath.logout, req).then(this.showMessage());
  }

  getStudents(req?: StudentsRequest): Promise<IResponse<StudentsResponse>> {
    return this.get<IResponse<StudentsResponse>>(
      RootPath.students,
      (req as unknown) as QueryParams
    );
  }

  addStudent(req: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
    return this.post([RootPath.students, SubPath.add], req).then(this.showMessage(true));
  }

  updateStudent(req: UpdateStudentRequest): Promise<IResponse<UpdateStudentResponse>> {
    return this.post([RootPath.students, SubPath.update], req).then(this.showMessage(true));
  }

  deleteStudent(req: DeleteRequest): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.students, SubPath.delete], req).then(this.showMessage(true));
  }

  getStudentById(id: number): Promise<IResponse<StudentResponse>> {
    return this.get(RootPath.student, { id }).then(this.showMessage());
  }

  getCourses<T = CourseResponse>(req: Partial<CourseRequest>): Promise<IResponse<T>> {
    return this.get(RootPath.courses, { ...req }).then(this.showMessage());
  }

  getCourseById(id: number): Promise<IResponse<CourseDetailResponse>> {
    return this.get(RootPath.course, { id }).then(this.showMessage());
  }

  addCourse(req: AddCourseRequest): Promise<IResponse<AddCourseResponse>> {
    return this.post([RootPath.courses, SubPath.add], req).then(this.showMessage(true));
  }

  updateSchedule(req: ScheduleRequest): Promise<IResponse<boolean>> {
    return this.post([RootPath.courses, SubPath.schedule], req).then(this.showMessage(true));
  }

  updateCourse(req: UpdateCourseRequest): Promise<IResponse<UpdateCourseResponse>> {
    return this.post([RootPath.courses, SubPath.update], req).then(this.showMessage(true));
  }

  getScheduleById(id: number): Promise<IResponse<Schedule>> {
    return this.get<IResponse<Schedule>>([RootPath.courses, SubPath.schedule], { id }).then(
      this.showMessage()
    );
  }

  createCourseCode(): Promise<IResponse<string>> {
    return this.get([RootPath.course, SubPath.code]).then(this.showMessage());
  }

  getCourseTypes(): Promise<IResponse<CourseType[]>> {
    return this.get([RootPath.course, SubPath.type]).then(this.showMessage());
  }

  getTeachers(req?: TeachersRequest): Promise<IResponse<TeachersResponse>> {
    return this.get<IResponse<TeachersResponse>>(
      RootPath.teachers,
      (req as unknown) as QueryParams
    ).then(this.showMessage());
  }

  getTeacherById(id: number): Promise<IResponse<TeacherResponse>> {
    return this.get<IResponse<TeacherResponse>>(RootPath.teacher, { id }).then(this.showMessage());
  }

  addTeacher(req: AddTeacherRequest): Promise<IResponse<AddTeacherResponse>> {
    return this.post([RootPath.teachers, SubPath.add], req).then(this.showMessage(true));
  }

  updateTeacher(req: UpdateTeacherRequest): Promise<IResponse<UpdateTeacherResponse>> {
    return this.post([RootPath.teachers, SubPath.update], req).then(this.showMessage(true));
  }

  deleteTeacher(req: DeleteRequest): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.teachers, SubPath.delete], req).then(this.showMessage(true));
  }

  getStatisticsOverview(): Promise<IResponse<StatisticsOverviewResponse>> {
    return this.get<IResponse<StatisticsOverviewResponse>>([
      RootPath.statistics,
      SubPath.overview,
    ]).then(this.showMessage());
  }

  getStatistics<T, U = Statistic>(
    type: StatisticsType,
    userId: number
  ): Promise<IResponse<StatisticsResponse<T, U>>> {
    return this.get<IResponse<StatisticsResponse<T, U>>>([RootPath.statistics, type], {
      userId,
    }).then(this.showMessage());
  }

  getClassSchedule(userId: number): Promise<IResponse<ClassSchedule[]>> {
    return this.get<IResponse<ClassSchedule[]>>([RootPath.student, SubPath.schedule], {
      userId,
    }).then(this.showMessage());
  }

  getProfileByUserId<T>(userId: number, userType?: Role): Promise<IResponse<T>> {
    return this.get<IResponse<T>>([RootPath.profile], {
      userId,
      userType: userType || storage.userType,
    }).then(this.showMessage());
  }

  getAllInterestLanguages(): Promise<IResponse<string[]>> {
    return this.get([RootPath.student, SubPath.interest]).then(this.showMessage());
  }

  getDegrees(): Promise<IResponse<Degree[]>> {
    return this.get([RootPath.degrees]).then(this.showMessage());
  }

  getCountries(): Promise<IResponse<Country[]>> {
    return this.get([RootPath.countries]).then(this.showMessage());
  }

  updateProfile<T>(req: Partial<T>): Promise<IResponse<T>> {
    return this.post([RootPath.profile], { ...req, userId: storage.userId }).then(
      this.showMessage(true)
    );
  }

  /* Helper Function
   * To get the countries of a specific region
   * */
  getWorld = async () => {
    return await axios.get(
      'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
    );
  };
}

export const apiService = new ApiService();

export default apiService;
