import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Role } from '../lib/constant';
import { routes, SideNav } from '../lib/constant/routes';
import { deepSearchFactory, getSideNavNameByPath } from '../lib/util';
import { useUserType } from './custom-hooks/login-state';

export default function AppBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').slice(1);
  const root = '/' + paths.slice(0, 2).join('/');
  const sub = paths.slice(2);
  const userType = useUserType();
  const sideNav = routes.get(userType);

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userType.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>

      {sub
        .map((item, index) => {
          const path = [root, ...sub.slice(0, index + 1)].join('/');
          const names = getSideNavNameByPath(sideNav, path);

          return [Role.student, Role.manager, Role.teacher].find((role) => role === item)
            ? null
            : names.map((name) => {
                const target = deepSearchFactory(
                  (nav: SideNav, value: any) => nav.label === value,
                  name,
                  'subNav'
                )(sideNav);
                
                return (
                  <Breadcrumb.Item key={index}>
                    {index === sub.length - 1 || !target.path.length ? (
                      name
                    ) : (
                      <Link href={path}>{name}</Link>
                    )}
                  </Breadcrumb.Item>
                );
              });
        }, [])
        .reduce((acc, cur) => [...acc, ...cur], [])}
    </Breadcrumb>
  );
}
