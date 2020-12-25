import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { routes, SideNav } from '../../lib/constant/routes';
import { StudentProfile } from '../../lib/model';
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import { generateKey, getActiveKey } from '../../lib/util';
import AppBreadcrumb from '../breadcrumb';
import { useUserType } from '../custom-hooks/login-state';

const { Header, Content, Sider } = Layout;

const Logo = styled.div`
  height: 64px;
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  letter-space: 5px;
  text-shadow: 5px 1px 5px;
  transform: rotateX(45deg);
  font-family: monospace;
`;

const HeaderIcon = styled.div`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

const StyledLayoutHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StyledContent = styled(Content)`
  margin: 16px;
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

const getMenuConfig = (
  data: SideNav[]
): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = getActiveKey(data);
  const defaultSelectedKeys = [key.split('/').pop()];
  const defaultOpenKeys = key.split('/').slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

function renderMenuItems(data: SideNav[], parent = ''): JSX.Element[] {
  const userType = useUserType();

  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subNav, item.path.join('/'))}
        </Menu.SubMenu>
      );
    } else {
      return item.hide ? null : (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
            <Link
              href={['/dashboard', userType, parent, ...item.path]
                .filter((item) => !!item)
                .join('/')}
              replace
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
}

export default function AppLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, toggleCollapse] = useState(false);
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const userType = useUserType();
  const sideNave = routes.get(userType);
  const onLogout = async () => {
    const { data: isLogout } = await apiService.logout({ token: storage.token });

    if (isLogout) {
      storage.deleteUserInfo();
      router.push('/login');
    }
  };
  const menuItems = renderMenuItems(sideNave);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNave);

  /**
   * !!FIXME: Warning: React has detected a change in the order of Hooks called by AppLayout.
   */
  useEffect(() => {
    apiService.getProfileByUserId<StudentProfile>(storage.userId).then((res) => {
      const { data } = res;

      setAvatar(data?.avatar);
    });
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(isCollapsed) => toggleCollapse(isCollapsed)}
      >
        {<Logo>CMS</Logo>}
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItems}
        </Menu>
      </Sider>

      <Layout id="contentLayout">
        <StyledLayoutHeader>
          <HeaderIcon onClick={() => toggleCollapse(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </HeaderIcon>

          <HeaderIcon>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <ProfileOutlined />
                    <Link href={`/dashboard/${storage.userType}/profile`}>
                      <span>Profile</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item onClick={onLogout}>
                    <LogoutOutlined />
                    <span>Logout</span>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              {avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
            </Dropdown>
          </HeaderIcon>
        </StyledLayoutHeader>

        <AppBreadcrumb />

        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
}
