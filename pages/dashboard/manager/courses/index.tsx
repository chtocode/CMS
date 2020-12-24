import { Button, List, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import BackTop from '../../../../components/common/back-top';
import CourseOverview from '../../../../components/course/overview';
import AppLayout from '../../../../components/layout/layout';
import { Paginator } from '../../../../lib/model';
import { Course } from '../../../../lib/model/course';
import apiService from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';

const Indicator = styled.div`
  position: relative;
  left: 50%,
  margin-top: 10px;
  transform: translateX(50%);
`;

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState<boolean>(true);

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
              <CourseOverview {...item}>
                <Link href={`/dashboard/${storage.userType}/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>
      <BackTop />
    </AppLayout>
  );
}
