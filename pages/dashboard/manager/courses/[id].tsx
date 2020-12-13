import { Badge, Card, Col, Collapse, Row, Steps, Tag } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import WeekCalendar from '../../../../components/common/week-calendar';
import CourseOverview from '../../../../components/course/overview';
import Layout from '../../../../components/layout/layout';
import { CourseDetail, Process } from '../../../../lib/model/course';
import apiService from '../../../../lib/services/api-service';

const H2 = styled.h2`
  color: #7356f1;
`;

const H3 = styled.h3`
  margin: 1em 0;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-bottom: none;
  :last-child {
    border-right: none;
  }
  p {
    margin-bottom: 0;
  }
  b {
    color: #7356f1;
    font-size: 24px;
  }
`;

const StyledRow = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

enum CourseStatus {
  'warning',
  'success',
  'default',
}

export async function getServerSideProps(context) {
  // todo get student profile here;
  const { id } = context.params;

  return {
    props: { id: id },
  };
}

const getChapterExtra = (source: Process, index: number) => {
  const activeIndex = source.chapters.findIndex((item) => item.id === source.current);

  if (index === activeIndex) {
    return <Tag color={'green'}>进行中</Tag>;
  } else if (index < activeIndex) {
    return <Tag color={'default'}>已完成</Tag>;
  } else {
    return <Tag color={'orange'}>未开始</Tag>;
  }
};

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [data, setData] = useState<CourseDetail>(null);

  useEffect(() => {
    (async () => {
      const id = +router.query.id || props.id;
      const { data } = await apiService.getCourseById(id);
      
      if (data) {
        const sales = data.sales;
        const info = [
          { label: 'Price', value: sales.price },
          { label: 'Batches', value: sales.batches },
          { label: 'Students', value: sales.studentAmount },
          { label: 'Earings', value: sales.earnings },
        ];

        setInfo(info);
        setActiveChapterIndex(
          data.process.chapters.findIndex((item) => item.id === data.process.current)
        );
        setData(data);
      }
    })();
  }, []);

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseOverview {...data} cardProps={{ bodyStyle: { paddingBottom: 0 } }}>
            <StyledRow gutter={[6, 16]} justify="space-between" align="middle">
              {info.map((item, index) => (
                <StyledCol span="6" key={index}>
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </StyledCol>
              ))}
            </StyledRow>
          </CourseOverview>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <H2>Course Detail</H2>

            <H3>Create Time</H3>
            <Row>{data?.ctime}</Row>

            <H3>Start Time</H3>
            <Row>{data?.startTime}</Row>

            <Badge status={CourseStatus[data?.status] as any} offset={[5, 24]}>
              <H3>Status</H3>
            </Badge>
            <Row>
              <Steps size="small" current={activeChapterIndex}>
                {data?.process.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </Row>

            <H3>Course Code</H3>
            <Row>{data?.uid}</Row>

            <H3>Class Time</H3>
            <WeekCalendar data={data?.process.classTime} />

            <H3>Category</H3>
            <Row>
              <Tag color={'geekblue'}>{data?.typeName}</Tag>
            </Row>

            <H3>Description</H3>
            {/** FIXME just for test purpose */}
            {data?.detail !== 'no' ? (
              <Row>{data?.detail}</Row>
            ) : (
              <Row>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum, iure soluta.
                Perspiciatis, odit perferendis suscipit alias aut voluptatem aliquam dolorem rerum
                animi tempore nostrum cum non temporibus rem cupiditate optio.
              </Row>
            )}

            <H3>Chapter</H3>
            {data?.process && (
              <Collapse defaultActiveKey={data.process.current}>
                {data.process.chapters.map((item, index) => (
                  <Collapse.Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(data.process, index)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
