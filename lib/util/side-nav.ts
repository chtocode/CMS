import { memoize } from 'lodash';
import { useRouter } from 'next/router';
import { useUserType } from '../../components/custom-hooks/login-state';
import { SideNav } from '../constant/routes';

/**
 * 生成key
 */
export const generateKey = (data: SideNav, index: number): string => {
  return `${data.label}_${index}`;
};

/**
 *  通过key获取当前sideNav的名称，也就是label
 */
export const getSideNavNameByKey = (key: string): string[] => {
  return key.split('/').map((item) => item.split('_')[0]);
};

/**
 * 生成路径
 * @param data - side nav config
 */
const generatePath = (data: SideNav): string => {
  return data.path.join('/');
};

/**
 * 生成key 或 path 的工厂函数
 * @param fn - 生成key或path的函数
 * @return - 执行函数
 */
const generateFactory = (fn: (data: SideNav, index: number) => string) =>
  function inner(data: SideNav[], current = ''): string[][] {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };

/**
 * 判断当前路径是否指向一个详情页
 */
const isDetailPath = (path: string): boolean => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

/**
 * 忽略详情路径上的参数路径
 */
const omitDetailPath = (path: string): string => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

/**
 * 根据路由信息找出生成当前side nav 的 key，path 信息
 */
const getKeyPathInfo = (data: SideNav[]): { keys: string[]; paths: string[] } => {
  const getPaths = generateFactory(generatePath);
  const userType = useUserType();
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) => ['/dashboard', userType, item].filter((item) => !!item).join('/'));
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

/**
 * getKeyPathInfo 的缓存版本，避免获取相同的sideNav的key path时递归过程重复执行
 */
const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
  data.map((item) => item.label).join('_')
);

/**
 * 获取当前活动的sideNav
 */
export const getActiveKey = (data: SideNav[]) => {
  const router = useRouter();
  const activeRoute = omitDetailPath(router.pathname);
  const { paths, keys } = memoizedGetKeyPathInfo(data);
  const index = paths.findIndex((item) => item === activeRoute);

  return keys[index] || '';
};

/**
 * 根据路径获取sideNav名称
 */
export const getSideNavNameByPath = (data: SideNav[], path: string): string[] => {
  if (isDetailPath(path)) {
    return ['Detail'];
  }

  const { paths, keys } = memoizedGetKeyPathInfo(data);
  const index = paths.findIndex((item) => item === path);

  return getSideNavNameByKey(keys[index]);
};
