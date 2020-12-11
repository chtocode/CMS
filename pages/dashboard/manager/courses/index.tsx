import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Spin } from 'antd';
import { Gutter } from 'antd/lib/grid/row';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import BackTop from '../../../../components/common/back-top';
import AppLayout from '../../../../components/layout/layout';
import { DurationUnit } from '../../../../lib/constant/duration';
import { Paginator } from '../../../../lib/model';
import { Course } from '../../../../lib/model/course';
import apiService from '../../../../lib/services/api-service';

const StyledRow = styled(Row)`
  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #ccc;
    width: 100%;
    height: 1px;
  }
`;

const Indicator = styled.div`
  position: relative;
  left: 50%,
  margin-top: 10px;
  transform: translateX(50%);
`;

const getDuration = (data: Course): string => { 
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;
  
  return duration > 1 ?  text+'s': text;
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const gutter: [Gutter, Gutter] = [6, 16];

  useEffect(() => {
    apiService.getCourses(paginator).then((res) => {
      const {
        data: { total, courses: fresh },
      } = res;
      const source = [...courses, ...fresh];

      setCourses(source);
      setHasMore(total > source.length);
    });
  }, [paginator]);

  return (
    <AppLayout>
      <InfiniteScroll
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="large" />
          </Indicator>
        }
        dataLength={courses.length}
        endMessage={<Indicator>No More Course!</Indicator>}
        scrollableTarget="contentLayout"
        style={{ overflow: 'hidden' }}
      >
        <List
          id="container"
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card cover={<img src={item.cover} />}>
                <Row gutter={gutter}>
                  <h3>{item.name}</h3>
                </Row>

                <StyledRow gutter={gutter} justify="space-between" align="middle">
                  <Col>{item.startTime}</Col>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                    <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} />
                    <b>{item.star}</b>
                  </Col>
                </StyledRow>

                <StyledRow gutter={gutter} justify="space-between">
                  <Col>Duration:</Col>
                  <Col>
                    <b>{getDuration(item)}</b>
                  </Col>
                </StyledRow>

                <StyledRow gutter={gutter} justify="space-between">
                  <Col>Teacher:</Col>
                  <Col>
                    <b>{item.teacher}</b>
                  </Col>
                </StyledRow>

                <Row gutter={gutter} justify="space-between">
                  <Col>
                    <UserOutlined style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }} />
                    <span>Student Amount:</span>
                  </Col>
                  <Col>
                    <b>{item.maxStudents}</b>
                  </Col>
                </Row>

                <Button type="primary">Read More</Button>
              </Card>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>
      <BackTop />
    </AppLayout>
  );
}
