import { Button, List, Spin } from 'antd';
import Link from 'next/link';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackTop from '../../../../components/common/back-top';
import { Indicator } from '../../../../components/common/styled';
import CourseOverview from '../../../../components/course/overview';
import { useScrollLoad } from '../../../../components/custom-hooks/scroll-load';
import AppLayout from '../../../../components/layout/layout';
import { Course, CourseRequest, CourseResponse } from '../../../../lib/model';
import apiService from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';

export function ScrollMode() {
  const { paginator, setPaginator, hasMore, data } = useScrollLoad<
    CourseRequest,
    CourseResponse,
    Course
  >(apiService.getCourses.bind(apiService), 'courses', false);

  return (
    <>
      <InfiniteScroll
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="large" />
          </Indicator>
        }
        dataLength={data.length}
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
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
                <Link href={`/dashboard/${storage.role}/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>
      <BackTop />
    </>
  );
}

export default function Page() {
  return (
    <AppLayout>
      <ScrollMode />
    </AppLayout>
  );
}
