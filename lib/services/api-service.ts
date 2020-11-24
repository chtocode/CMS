import axios from 'axios';
import { LoginRequest, LoginResponse } from '../model/login';

const axiosInstance = axios.create({
  withCredentials: true,
  // baseURL: 'http://localhost:3000',
});

class ApiService {
  login(req: LoginRequest): Promise<LoginResponse> {
    return axiosInstance
      .post('api/login', req)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }
}

const instance = new ApiService();

export default instance;
