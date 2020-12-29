import { BulbOutlined, DesktopOutlined, SafetyOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row } from 'antd';
import React, { createContext } from 'react';
import { OverviewProps } from '../lib/model';
import { OverviewCol, OverviewIconCol } from './common/styled';

export interface OverviewStatistic {
  amount: number;
  total: number;
  status: number;
}

export const overviewProgressContext = createContext<{
  percentage: number;
  status: string | undefined;
}>({ percentage: 0, status: '' });

export const Overview = ({
  data,
  title,
  icon,
  style,
  mainKey = 'amount',
  children,
}: React.PropsWithChildren<OverviewProps<OverviewStatistic>>) => {
  const percentage = +parseFloat(String((data.amount / data.total) * 100)).toFixed(1);
  const des = ['pending', 'in active', 'have done'];
  const { Provider } = overviewProgressContext;

  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', ...style }}>
      <Row>
        <OverviewIconCol>{icon}</OverviewIconCol>
        <OverviewCol offset={1} flex={1}>
          <h3>{title}</h3>
          {data && (
            <Provider value={{ percentage, status: des[data.status] }}>
              <h2>{data[mainKey]}</h2>
              <Progress
                percent={100 - percentage}
                size="small"
                showInfo={false}
                strokeColor="white"
                trailColor="lightgreen"
              />
              {children || <p>{`${percentage + '%'} course ${des[data.status]}`}</p>}
            </Provider>
          )}
        </OverviewCol>
      </Row>
    </Card>
  );
};

const UserOverview = ({
  overview,
  total,
  extra = [],
}: {
  overview: OverviewStatistic[];
  total: number;
  extra?: JSX.Element[];
}) => {
  const getOverviewData = (status: number): OverviewStatistic => {
    const target = overview.find((item) => item.status === status);

    return target ? target : { status, amount: 0, total };
  };
  const columns = [
    <Overview
      title="Pending"
      icon={<BulbOutlined />}
      data={getOverviewData(0)}
      style={{ background: '#1890ff' }}
    ></Overview>,

    <Overview
      title="Active"
      icon={<DesktopOutlined />}
      data={getOverviewData(1)}
      style={{ background: '#673bb7' }}
    ></Overview>,

    <Overview
      title="Done"
      icon={<SafetyOutlined />}
      data={getOverviewData(2)}
      style={{ background: '#ffaa16' }}
    ></Overview>,
    ...extra,
  ];

  return (
    <Row align="middle" justify="space-between" gutter={[24, 16]}>
      {columns.map((overview, index) => (
        <Col flex={1} key={index}>
          {overview}
        </Col>
      ))}
    </Row>
  );
};

export default UserOverview;
