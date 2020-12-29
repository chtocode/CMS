import { TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppLayout from '../../../components/layout/layout';
import HeatChart from '../../../components/manager/heat';
import LineChart from '../../../components/manager/line';
import PieChart from '../../../components/manager/pie';
import UserOverview, {
  Overview,
  overviewProgressContext,
  OverviewStatistic
} from '../../../components/user-overview';
import { gutter, Role } from '../../../lib/constant';
import { Course, Schedule } from '../../../lib/model';
import { CourseClassTimeStatistic, Statistic } from '../../../lib/model/statistics';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';

const ProgressDescription = () => {
  const { percentage } = useContext(overviewProgressContext);

  return <p>{`${percentage + '%'} Increase in 30 Days `}</p>;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState<OverviewStatistic[]>(null);
  const [studentStatisticOverview, setStudentStatisticOverview] = useState({
    amount: 0,
    total: 0,
    status: null,
  });
  const [courseTotal, setCourseTotal] = useState(0);

  useEffect(() => {
    apiService
      .getStatistics<Course & Schedule, CourseClassTimeStatistic>(Role.teacher, storage.userId)
      .then((res) => {
        const { data } = res;
        const status = data?.status as Statistic[];
        const total = status.reduce((acc, cur) => acc + cur.amount, 0);
        const overview = status.map((item) => ({ status: +item.name, amount: item.amount, total }));

        setCourseTotal(total);
        setOverview(overview);
        setData(data);
      });

    apiService.getStatistics(Role.student, storage.userId).then((res) => {
      const { data } = res;

      setStudentStatisticOverview({
        ...studentStatisticOverview,
        amount: (data as Statistic).lastMonthAdded,
        total: (data as Statistic).total,
      });
    });

    return () => {};
  }, []);

  return (
    <AppLayout>
      {data ? (
        <>
          <UserOverview
            overview={overview}
            total={courseTotal}
            extra={[
              <Overview
                data={studentStatisticOverview}
                title="Students"
                mainKey="total"
                icon={<TeamOutlined />}
                style={{ background: 'green' }}
              >
                <ProgressDescription />
              </Overview>,
            ]}
          />

          <Row gutter={gutter}>
            <Col span={12}>
              <Card title="Course Category">
                <PieChart data={data?.typeName as Statistic[]} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Course Increment">
                <LineChart data={{ course: data?.ctime as Statistic[] }} />
              </Card>
            </Col>
          </Row>

          <Row gutter={gutter}>
            <Col span={24}>
              <Card title="Course Schedule">
                <HeatChart
                  data={data?.classTime as CourseClassTimeStatistic[]}
                  title="Course schedule per weekday"
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
    </AppLayout>
  );
}
