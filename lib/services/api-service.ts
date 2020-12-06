import { message } from 'antd';
import axios, { AxiosError } from 'axios';
import {
  AddStudentRequest,
  AddStudentResponse,
  LogoutRequest,
  LogoutResponse,
  StudentsRequest,
  StudentsResponse,
  UpdateStudentRequest,
  UpdateStudentResponse
} from '../model';
import { DeleteRequest, DeleteResponse, IResponse, QueryParams } from '../model/api';
import { LoginRequest, LoginResponse } from '../model/login';
import { rootPath, subPath } from './api-path';

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
      .get(path)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path), { params })
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
    return this.get<IResponse<LoginResponse>>(rootPath.login, (req as unknown) as QueryParams).then(
      this.showMessage()
    );
  }

  /**
   * ? unused get user type by token
   */
  getUserType(token: string): Promise<IResponse<string>> {
    return this.get<IResponse<string>>(rootPath.userType, { token }).then(this.showMessage());
  }

  logout(req: LogoutRequest): Promise<IResponse<LogoutResponse>> {
    return this.post<IResponse<LogoutResponse>>(rootPath.logout, req).then(this.showMessage());
  }

  getStudents(req?: StudentsRequest): Promise<IResponse<StudentsResponse>> {
    return this.get<IResponse<StudentsResponse>>(
      rootPath.students,
      (req as unknown) as QueryParams
    );
  }

  addStudent(req: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
    return this.post([rootPath.students, subPath.add], req).then(this.showMessage(true));
  }

  updateStudent(req: UpdateStudentRequest): Promise<IResponse<UpdateStudentResponse>> {
    return this.post([rootPath.students, subPath.update], req).then(this.showMessage(true));
  }

  deleteStudent(req: DeleteRequest): Promise<IResponse<DeleteResponse>> {
    return this.delete([rootPath.students, subPath.delete], req).then(this.showMessage(true));
  }

  getStudent(): Promise<any> {
    return this.get([rootPath.students, subPath.detail]);
  }
}

export const apiService = new ApiService();

export default apiService;
