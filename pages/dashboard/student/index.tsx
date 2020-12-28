import {
  BulbOutlined,
  CalendarFilled,
  DesktopOutlined,
  HeartFilled,
  ReloadOutlined,
  SafetyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import {
  Card,
  Col,
  List,
  message,
  Progress,
  Row,
  Space,
  Statistic as StatisticComponent,
  Tooltip
} from 'antd';
import { isFuture } from 'date-fns';
import { groupBy } from 'lodash';
import Link from 'next/link';
import React, { Reducer, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { OverviewCol, OverviewIconCol } from '../../../components/common/styled';
import AppLayout from '../../../components/layout/layout';
import { DurationUnit, gutter } from '../../../lib/constant';
import { Course, OverviewProps } from '../../../lib/model';
import { Statistic } from '../../../lib/model/statistics';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
interface StudentStatistic {
  own: Statistic;
  recommend: Statistic;
}

interface OverviewStatistic {
  amount: number;
  total: number;
  status: number;
}

interface StoreState {
  page: number;
  max: number;
  recommend: Course[];
}

type ActionType = 'increment' | 'reset' | 'setMax' | 'setRecommend';

type Action = {
  type: ActionType;
  payload?: number | Course[];
};

const Overview = ({ data, title, icon, style }: OverviewProps<OverviewStatistic>) => {
  const percentage = +parseFloat(String((data.amount / data.total) * 100)).toFixed(1);
  const des = ['pending', 'in active', 'have done'];

  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', ...style }}>
      <Row>
        <OverviewIconCol span={6}>{icon}</OverviewIconCol>
        <OverviewCol span={18}>
          <h3>{title}</h3>
          {data && (
            <>
              <h2>{data.amount}</h2>
              <Progress
                percent={100 - percentage}
                size="small"
                showInfo={false}
                strokeColor="white"
                trailColor="lightgreen"
              />
              <p>{`${percentage + '%'} lessons ${des[data.status]}`}</p>
            </>
          )}
        </OverviewCol>
      </Row>
    </Card>
  );
};

const { Countdown } = StatisticComponent;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const StyledList = styled(List)`
  .ant-list-item {
    position: relative;
  }
  .ant-list-item-action {
    position: absolute;
    left: 240px;
    bottom: 30px;
  }
  .ant-list-item-meta-description {
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const initialState: StoreState = { page: 1, max: 0, recommend: [] };

const limit = 5;

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'increment':
      return { ...state, page: state.page + 1 };
    case 'reset':
      return { ...state, page: 1 };
    case 'setMax':
      return { ...state, max: action.payload as number };
    case 'setRecommend':
      return { ...state, recommend: action.payload as Course[] };
    default:
      throw new Error();
  }
}

export default function Dashboard() {
  const [data, setData] = useState<StudentStatistic>(null);
  const [overview, setOverview] = useState<OverviewStatistic[]>(null);
  const getOverviewData = (status: number): OverviewStatistic => {
    const target = overview.find((item) => item.status === status);

    return target ? target : { status, amount: 0, total: data.own.courses.length };
  };
  const [state, dispatch] = useReducer<Reducer<StoreState, Action>>(reducer, initialState);
  const changeBatch = async () => {
    try {
      const { page } = state;
      const current = page * limit > state.max ? 1 : page;
      const {
        data: { courses, total },
      } = await apiService.getCourses({ page: current, limit });

      dispatch({ type: page * limit > total ? 'reset' : 'increment' });

      if (total !== state.max) {
        dispatch({ type: 'setMax', payload: total });
      }

      dispatch({ type: 'setRecommend', payload: courses });
    } catch (err) {
      message.error('Server is business, please try again later!');
    }
  };

  useEffect(() => {
    apiService.getStatistics<StudentStatistic>('student', storage.userId).then((res) => {
      const { data } = res;
      const { own, recommend } = data;
      const ownCourses = (own as Statistic).courses;
      const overview = Object.entries(groupBy(ownCourses, (item) => item.course.status)).map(
        ([status, values]) => ({
          status: +status,
          total: ownCourses.length,
          amount: values.length,
        })
      );

      setOverview(overview);
      dispatch({ type: 'setRecommend', payload: (recommend as Statistic).courses });
      setData(data as StudentStatistic);
    });

    return () => {};
  }, []);

  return (
    <AppLayout>
      {data ? (
        <>
          <Row gutter={gutter}>
            <Col span={8}>
              <Overview
                title="Pending"
                icon={<BulbOutlined />}
                data={getOverviewData(0)}
                style={{ background: '#1890ff' }}
              ></Overview>
            </Col>
            <Col span={8}>
              <Overview
                title="Active"
                icon={<DesktopOutlined />}
                data={getOverviewData(1)}
                style={{ background: '#673bb7' }}
              ></Overview>
            </Col>
            <Col span={8}>
              <Overview
                title="Done"
                icon={<SafetyOutlined />}
                data={getOverviewData(2)}
                style={{ background: '#ffaa16' }}
              ></Overview>
            </Col>
          </Row>

          <Card
            title={<h3> Courses you might be interested in </h3>}
            extra={
              <Tooltip title="Change batch">
                <ReloadOutlined
                  onClick={changeBatch}
                  style={{ color: '#1890ff', fontSize: 18, cursor: 'pointer' }}
                />
              </Tooltip>
            }
          >
            <StyledList
              id="container"
              itemLayout="vertical"
              size="large"
              dataSource={state.recommend}
              renderItem={(item: Course) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Countdown
                      title={isFuture(new Date(item.startTime)) ? 'Cutdown' : 'In Progress'}
                      value={new Date(item.startTime).getTime()}
                      format={'D 天 H 时 m 分 s 秒'}
                    />
                  }
                  actions={[
                    <IconText
                      icon={TeamOutlined}
                      text={item.maxStudents}
                      key="list-vertical-limit-o"
                    />,
                    <IconText icon={HeartFilled} text={item.star} key="list-vertical-star-o" />,
                    <IconText
                      icon={CalendarFilled}
                      text={item.duration + ' ' + DurationUnit[item.durationUnit]}
                      key="list-vertical-calendar-o"
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<img src={item.cover} width="200px" />}
                    title={
                      <Link href={`/dashboard/${storage.userType}/courses/${item.id}`} passHref>
                        {item.name}
                      </Link>
                    }
                    description={item.detail}
                  ></List.Item.Meta>
                </List.Item>
              )}
            ></StyledList>
          </Card>
        </>
      ) : null}
    </AppLayout>
  );
}
