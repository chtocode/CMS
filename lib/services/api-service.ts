import axios from 'axios';
import { LogoutRequest, LogoutResponse, Student } from '../model';
import { LoginRequest, LoginResponse } from '../model/login';

const axiosInstance = axios.create({
  withCredentials: true,
  // baseURL: 'http://localhost:3000',
  responseType: 'json',
});

class ApiService {
  async login(req: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await axiosInstance.post('api/login', req);
      console.log(res.data);

      return res.data;
    } catch (err) {
      console.error(err);

      return err;
    }
  }

  async logout(req: LogoutRequest): Promise<LogoutResponse> {
    try {
      const res = await axiosInstance.post('api/logout', req);

      return res.data;
    } catch (err) {
      console.error(err);

      return err;
    }
  }

  async getStudents(): Promise<Student[]> {
    try {
      const res = await axiosInstance.get<{ students: Student[] }>('api/students');

      return res.data.students;
    } catch (err) {
      console.error(err);

      return err;
    }
  }
}

const instance = new ApiService();

export default instance;
