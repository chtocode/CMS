import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { CardProps } from 'antd/lib/card';
import { Gutter } from 'antd/lib/grid/row';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { DurationUnit } from '../../lib/constant/duration';
import { Course } from '../../lib/model/course';

const StyledRow = styled(Row)`
  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px;
  }
`;

const getDuration = (data: Course): string => {
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;

  return duration > 1 ? text + 's' : text;
};

export default function CourseOverview(
  props: React.PropsWithChildren<Course> & { cardProps?: CardProps }
) {
  const gutter: [Gutter, Gutter] = [6, 16];

  return (
    <Card cover={<img src={props.cover} />} {...props.cardProps}>
      <Row gutter={gutter}>
        <h3>{props.name}</h3>
      </Row>

      <StyledRow gutter={gutter} justify="space-between" align="middle">
        <Col>{props.startTime}</Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} />
          <b>{props.star}</b>
        </Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{getDuration(props)}</b>
        </Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>Teacher:</Col>
        <Col style={{ fontWeight: 'bold' }}>
          {props?.teacher && <Link href="/dashboard/manager">{props.teacher}</Link>}
        </Col>
      </StyledRow>

      <Row gutter={gutter} justify="space-between">
        <Col>
          <UserOutlined style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }} />
          <span>Student Limit:</span>
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>

      {props.children}
    </Card>
  );
}
