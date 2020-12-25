import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Select } from 'antd';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppLayout from '../../../components/layout/layout';
import BarChart from '../../../components/manager/bar';
import HeatChart from '../../../components/manager/heat';
import LineChart from '../../../components/manager/line';
import PieChart from '../../../components/manager/pie';
import { Role } from '../../../lib/constant';
import { Course, Schedule, StudentWithProfile, Teacher, TeacherProfile } from '../../../lib/model';
import {
  BasicStatistics,
  CourseClassTimeStatistic,
  CourseStatistics,
  Statistic,
  StatisticsOverviewResponse,
  StudentStatistics,
  TeacherStatistics
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
 * 使用地图时无法进行server side rendering
 */
// const DistrictWithNoSSR = dynamic(() => import('../../../components/common/district'), {
//   ssr: false,
// });

/**
 * 使用地图时无法进行server side rendering, 子组件需要获取地图数据
 */
const DistributionWithNoSSR = dynamic(() => import('../../../components/manager/distribution'), {
  ssr: false,
});

export default function Page() {
  const [overview, setOverview] = useState<StatisticsOverviewResponse>(null);
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics>(null);
  const [teacherStatistics, setTeacherStatistics] = useState<TeacherStatistics>(null);
  const [courseStatistics, setCourseStatistics] = useState<CourseStatistics>(null);
  const [distributionRole, setDistributionRole] = useState<string>(Role.student);
  const [selectedType, setSelectedType] = useState<string>('studentType');

  useEffect(() => {
    apiService.getStatisticsOverview().then((res) => {
      const { data } = res;

      setOverview(data);
    });

    apiService.getStatistics<StudentWithProfile>(Role.student).then((res) => {
      const { data } = res;

      setStudentStatistics(data);
    });

    apiService.getStatistics<TeacherProfile & Teacher>(Role.teacher).then((res) => {
      const { data } = res;

      setTeacherStatistics(data);
    });

    apiService.getStatistics<Course & Schedule, CourseClassTimeStatistic>('course').then((res) => {
      const { data } = res;

      setCourseStatistics(data);
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
          <Card
            title="Distribution"
            extra={
              <Select defaultValue="student" onSelect={setDistributionRole} bordered={false}>
                <Select.Option value={Role.student}>Student</Select.Option>
                <Select.Option value={Role.teacher}>Teacher</Select.Option>
              </Select>
            }
          >
            {/* <DistrictWithNoSSR data={studentStatistics?.country as Exclude<Statistic, number>[]} /> */}
            <DistributionWithNoSSR
              data={
                (distributionRole === Role.student
                  ? studentStatistics?.country
                  : teacherStatistics?.country) as Statistic[]
              }
              title={distributionRole}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Types"
            extra={
              <Select defaultValue={selectedType} bordered={false} onSelect={setSelectedType}>
                <Select.Option value="studentType">Student Type</Select.Option>
                <Select.Option value="courseType">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === 'studentType' ? (
              <PieChart data={studentStatistics?.typeName as Statistic[]} title={selectedType} />
            ) : selectedType === 'courseType' ? (
              <PieChart data={courseStatistics?.typeName as Statistic[]} title={selectedType} />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.student.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="student gender"
                  />
                </Col>

                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.teacher.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="teacher gender"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                [Role.student]: studentStatistics?.ctime as Statistic[],
                [Role.teacher]: teacherStatistics?.ctime as Statistic[],
                course: courseStatistics?.ctime as Statistic[],
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{
                interest: studentStatistics?.interest as Statistic[],
                teacher: teacherStatistics?.skills as Statistic[],
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatChart
              data={courseStatistics?.classTime as CourseClassTimeStatistic[]}
              title="Course schedule per weekday"
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
