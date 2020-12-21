import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row } from 'antd';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bar } from '../../../components/common/bar';
import { LineChart } from '../../../components/common/line';
import { Pie } from '../../../components/common/pie';
import AppLayout from '../../../components/layout/layout';
import { StudentProfile } from '../../../lib/model';
import {
  BasicStatistics,
  Statistic,
  StatisticsOverviewResponse,
  StudentStatistics
} from '../../../lib/model/statistics';
import apiService from '../../../lib/services/api-service';

interface OverviewProps {
  data: BasicStatistics;
  title: string;
  icon: JSX.Element;
  style?: React.CSSProperties;
}

const OverviewIconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`;
const OverviewCol = styled(Col)`
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`;

const Overview = ({ data, title, icon, style }: OverviewProps) => {
  const lastMonthAddedPercent = +parseFloat(
    String((data.lastMonthAdded / data.total) * 100)
  ).toFixed(1);

  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', ...style }}>
      <Row>
        <OverviewIconCol span={6}>{icon}</OverviewIconCol>
        <OverviewCol span={18}>
          <h3>{title}</h3>
          <h2>{data.total}</h2>
          <Progress
            percent={100 - lastMonthAddedPercent}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p>{`${lastMonthAddedPercent + '%'} Increase in 30 Days`}</p>
        </OverviewCol>
      </Row>
    </Card>
  );
};

/**
 * Implementation by amap;
 */
// const DistrictWithNoSSR = dynamic(() => import('../../../components/common/district'), {
//   ssr: false,
// });

const DistributionWithNoSSR = dynamic(() => import('../../../components/common/distribution'), {
  ssr: false,
});

export default function Page() {
  const [overview, setOverview] = useState<StatisticsOverviewResponse>(null);
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics>(null);

  useEffect(() => {
    apiService.getStatisticsOverview().then((res) => {
      const { data } = res;

      setOverview(data);
    });

    apiService.getStatistics<StudentProfile>('student').then((res) => {
      const { data } = res;

      setStudentStatistics(data);
    });
  }, []);

  return (
    <AppLayout>
      {overview && (
        <Row align="middle" gutter={[24, 16]}>
          <Col span={8}>
            <Overview
              title="TOTAL STUDENTS"
              data={overview.student}
              icon={<SolutionOutlined />}
              style={{ background: '#1890ff' }}
            />
          </Col>

          <Col span={8}>
            <Overview
              title="TOTAL TEACHERS"
              data={overview.teacher}
              icon={<DeploymentUnitOutlined />}
              style={{ background: '#673bb7' }}
            />
          </Col>

          <Col span={8}>
            <Overview
              title="TOTAL COURSES"
              data={overview.course}
              icon={<ReadOutlined />}
              style={{ background: '#ffaa16' }}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Student Distribution">
            {/* <DistrictWithNoSSR data={studentStatistics?.area as Exclude<Statistic, number>[]} /> */}
            <DistributionWithNoSSR data={studentStatistics?.area as Exclude<Statistic, number>[]} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Student Type">
            <Pie data={studentStatistics?.typeName as Exclude<Statistic, number>[]} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Students Increment">
            <LineChart data={studentStatistics?.ctime as Exclude<Statistic, number>[]} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Most Student Interested In">
            <Bar data={studentStatistics?.interest as Exclude<Statistic, number>[]} />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
