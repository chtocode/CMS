import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Role } from '../../lib/model';
import storage, { UserInfo } from '../../lib/services/storage';

export function useLoginState(): UserInfo {
  const router = useRouter();

  useEffect(() => {
    if (!storage.token) {
      router.push('/login', undefined, { shallow: true });
    }

    if (!!storage.role) {
      router.push(`/dashboard/${storage.role}`, undefined, { shallow: true });
    }
  }, []);

  return storage.userInfo;
}

export function useUserRole(): Role {
  const router = useRouter();

  return storage.role || (router.pathname.split('/')[2] as Role); // 2: path name start with a slash; e.g.: '/d/a' --split--> ['','d',a'];
}
