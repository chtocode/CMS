import { LoginResponse, Role } from '../model';

export type UserInfo = LoginResponse;

export class Storage {
  private key = 'cms';

  setUserInfo(info: UserInfo): void {
    localStorage.setItem(this.key, JSON.stringify(info));
  }

  get userInfo(): UserInfo {
    try {
      return JSON.parse(localStorage.getItem(this.key)) as UserInfo;
    } catch (error) {
      return null;
    }
  }

  get token(): string | null {
    return this.userInfo?.token;
  }

  get userType(): Role {
    return this.userInfo?.loginType;
  }

  get userId(): number {
    return +this.userInfo.userId;
  }

  deleteUserInfo(): void {
    localStorage.removeItem(this.key);
  }
}
export const storage = new Storage();

export default storage;
