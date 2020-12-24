import { Role } from './role';

export interface LoginFormValues {
  loginType: Role;
  email: string;
  password: string;
  remember: boolean;
}

export type LoginRequest = LoginFormValues;

export interface LoginResponse {
  token: string;
  loginType: Role;
  userId: number;
}
