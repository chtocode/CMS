import { Col, Input, Row, Select, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import AddCourseForm from '../../../components/course/add-course';
import UpdateChapterForm from '../../../components/course/update-chapter';
import AppLayout from '../../../components/layout/layout';
import { gutter } from '../../../lib/constant';
import { Course } from '../../../lib/model';
import apiService from '../../../lib/services/api-service';

const { Option } = Select;

export default function Page() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState<'uid' | 'name' | 'type'>('uid');
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(null);
  const search = useCallback(
    debounce((value: string) => {
      if (!value) {
        return;
      }

      setIsSearching(true);

      apiService
        .getCourses({ [searchBy]: value })
        .then((res) => {
          const { data } = res;

          if (!!data) {
            setSearchResult(data.courses);
          }
        })
        .finally(() => setIsSearching(false));
    }, 1000),
    [searchBy]
  );

  return (
    <AppLayout>
      <Row gutter={gutter}>
        <Col span={12} style={{ marginLeft: '1.6%' }}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select defaultValue="uid" onChange={(value) => setSearchBy(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              onSearch={search}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);

                setCourse(course);
              }}
            >
              {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} style={{ marginLeft: '1.6%' }} />
        )}
        type="card"
        size="large"
        animated
      >
        <Tabs.TabPane key="course" tab="Course Detail">
          <AddCourseForm course={course} />
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <UpdateChapterForm courseId={course?.id} scheduleId={course?.scheduleId} isAdd={false} />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  );
}
