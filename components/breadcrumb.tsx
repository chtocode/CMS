import { Breadcrumb } from 'antd';
import Link from 'next/link';
// import LayoutService from './layoutservice';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function AppBreadcrumb() {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    const query = router.query;

    // setBreadcrumb(getBreadcrumb(path, query));
  }, []);

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>
        <Link href="/">
          <a>管理面板</a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
