import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  List,
  Menu,
  message,
  notification,
  Row,
  Space,
  Spin,
  Tabs
} from 'antd';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { Role } from '../../lib/constant';
import { routes, SideNav } from '../../lib/constant/routes';
import { StudentProfile } from '../../lib/model';
import { Message, MessagesRequest, MessagesResponse, MessageType } from '../../lib/model/message';
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import { generateKey, getActiveKey } from '../../lib/util';
import AppBreadcrumb from '../breadcrumb';
import { useListEffect } from '../custom-hooks/list-effect';
import { useUserRole } from '../custom-hooks/login-state';
import { useMsgStatistic } from '../provider';

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

const HeaderIcon = styled.span`
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

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const TabPane = styled(Tabs.TabPane)`
  position: relative;
  .ant-list-item {
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background: #1890ff45;
    }
  }
  .ant-list-item-meta-title {
    margin-bottom: 0;
  }
  .ant-list-item-action {
    margin: 0 0 0 48px;
  }
  .ant-list-item-meta-avatar {
    align-self: flex-end;
  }
  .ant-list-item-meta-description {
    margin: 5px 0;
    white-space: normal;
    display: -webkit-box;
    max-height: 3em;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-list-item-meta {
    margin-bottom: 0;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
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
  const userRole = useUserRole();

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
              href={['/dashboard', userRole, parent, ...item.path]
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

interface MessagesProps {
  type: MessageType;
  scrollTarget: string;
  clearAll: number;
  onRead?: (amount: number) => void;
  message?: Message;
}

function Messages(props: MessagesProps): JSX.Element {
  const { paginator, setPaginator, hasMore, data, setData } = useListEffect<
    MessagesRequest,
    MessagesResponse,
    Message
  >(apiService.getMessages.bind(apiService), 'messages', false, { type: props.type });

  useEffect(() => {
    if (props.clearAll && data && data.length) {
      const ids = data.filter((item) => item.status === 0).map((item) => item.id);

      if (ids.length) {
        apiService.markAsRead(ids).then((res) => {
          if (res.data) {
            setData(data.map((item) => ({ ...item, status: 1 })));
          }

          if (props.onRead) {
            props.onRead(ids.length);
          }
        });
      } else {
        message.warn(`All of these ${props.type}s has been marked as read!`);
      }
    }
  }, [props.clearAll]);

  useEffect(() => {
    if (!!props.message && props.message.type === props.type) {
      setData([props.message, ...data]);
    }
  }, [props.message]);

  return (
    <InfiniteScroll
      next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
      dataLength={data.length}
      endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
      scrollableTarget={props.scrollTarget}
    >
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            style={{ opacity: item.status ? 0.4 : 1 }}
            actions={[
              <Space>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Space>,
            ]}
            onClick={() => {
              if (item.status === 1) {
                return;
              }

              apiService.markAsRead([item.id]).then((res) => {
                if (res.data) {
                  const target = data.find((msg) => item.id === msg.id);

                  target.status = 1;
                  setData([...data]);
                }

                if (props.onRead) {
                  props.onRead(1);
                }
              });
            }}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.from.nickname}
              description={item.content}
            />
          </List.Item>
        )}
      ></List>
    </InfiniteScroll>
  );
}

export function MessagePanel() {
  const types: MessageType[] = ['notification', 'message'];
  const [activeType, setActiveType] = useState<MessageType>('notification');
  const { msgStore, dispatch } = useMsgStatistic();
  // 为了让子组件监听到父组件中的状态
  const [clean, setClean] = useState<{ [key in MessageType]: number }>({
    notification: 0,
    message: 0,
  });
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    apiService.getMessageStatistic().then((res) => {
      const { data } = res;

      if (!!data) {
        const {
          receive: { notification, message },
        } = data;

        dispatch({ type: 'increment', payload: { type: 'message', count: message.unread } });
        dispatch({
          type: 'increment',
          payload: { type: 'notification', count: notification.unread },
        });
      }
    });

    const sse = new EventSource(
      `http://localhost:3001/api/message/subscribe?userId=${storage.userId}`,
      {
        withCredentials: true,
      }
    );

    sse.onmessage = (event) => {
      let { data } = event;

      data = JSON.parse(data || {});

      if (data.type !== 'heartbeat') {
        const content = data.content as Message;

        if (content.type === 'message') {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }

        setMessage(content);
        dispatch({ type: 'increment', payload: { type: content.type, count: 1 } });
      }
    };

    return () => {
      sse.close();
      dispatch({ type: 'reset' });
    };
  }, []);

  return (
    <Badge size="small" count={msgStore.total} offset={[10, 0]}>
      <HeaderIcon>
        <Dropdown
          overlayStyle={{
            background: '#fff',
            borderRadius: 4,
            width: 400,
            height: 500,
            overflow: 'hidden',
          }}
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <>
              <Tabs
                renderTabBar={(props, DefaultTabBar) => (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                )}
                onChange={(key: MessageType) => {
                  if (key !== activeType) {
                    setActiveType(key);
                  }
                }}
                animated
              >
                {types.map((type) => (
                  <TabPane key={type} tab={`${type} (${msgStore[type]})`}>
                    <MessageContainer id={type}>
                      <Messages
                        type={type}
                        scrollTarget={type}
                        clearAll={clean[type]}
                        onRead={(count) => {
                          dispatch({ type: 'decrement', payload: { type, count } });
                        }}
                        message={message}
                      />
                    </MessageContainer>
                  </TabPane>
                ))}
              </Tabs>

              <Footer justify="space-between" align="middle">
                <Col span={12}>
                  <Button onClick={() => setClean({ ...clean, [activeType]: ++clean[activeType] })}>
                    Mark all as read
                  </Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${storage.role}/message`}>View history</Link>
                  </Button>
                </Col>
              </Footer>
            </>
          }
        >
          <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
        </Dropdown>
      </HeaderIcon>
    </Badge>
  );
}

export default function AppLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, toggleCollapse] = useState(false);
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const userRole = useUserRole();
  const sideNave = routes.get(userRole);
  const onLogout = async () => {
    const { data: isLogout } = await apiService.logout();

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
    if (storage.role === Role.student || storage.role === Role.teacher) {
      apiService.getProfileByUserId<StudentProfile>(storage.userId).then((res) => {
        const { data } = res;

        setAvatar(data?.avatar);
      });
    }
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

          <Row align="middle">
            <MessagePanel />

            <HeaderIcon style={{ marginLeft: '2em' }}>
              <Dropdown
                overlay={
                  <Menu>
                    {userRole !== 'manager' && (
                      <Menu.Item>
                        <ProfileOutlined />
                        <Link href={`/dashboard/${storage.role}/profile`}>
                          <span>Profile</span>
                        </Link>
                      </Menu.Item>
                    )}
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
          </Row>
        </StyledLayoutHeader>

        <AppBreadcrumb />

        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
}
