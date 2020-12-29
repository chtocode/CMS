import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Table, Tag } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { formatDistanceToNow } from 'date-fns';
import { omitBy } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDebounceSearch } from '../../../../components/custom-hooks/debounce-search';
import AppLayout from '../../../../components/layout/layout';
import {
  CourseStatusColor,
  CourseStatusText,
  DurationUnit,
  gutter
} from '../../../../lib/constant';
import { StudentCourse, StudentOwnCoursesResponse } from '../../../../lib/model';
import { apiService } from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';

export default function Page() {
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Partial<TablePaginationConfig>>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [query, setQuery] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'name' | 'type'>('name');
  const columns: ColumnType<StudentCourse>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Course Name',
      dataIndex: ['course', 'name'],
      sortDirections: ['ascend', 'descend'],
      sorter: (pre: StudentCourse, next: StudentCourse) => {
        const preCode = pre.course.name.charCodeAt(0);
        const nextCode = next.course.name.charCodeAt(0);

        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      render: (_, record: StudentCourse) => (
        <Link href={`/dashboard/student/courses/${record.id}`}>{record.course.name}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: ['course', 'status'],
      render: (status: number) => (
        <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: ['course', 'duration'],
      render: (value, record: StudentCourse) =>
        `${value} ${DurationUnit[record.course.durationUnit]}`,
    },
    {
      title: 'Course Start',
      dataIndex: ['course', 'startTime'],
    },
    {
      title: 'Category',
      dataIndex: ['course', 'typeName'],
    },

    {
      title: 'Join Time',
      dataIndex: 'ctime',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
  ];
  const debouncedQuery = useDebounceSearch(setQuery);

  useEffect(() => {
    const req = omitBy(
      {
        limit: pagination.pageSize,
        page: pagination.current,
        userId: storage.userId,
        [searchBy]: query,
        own: true
      },
      (item) => item === ''
    );
    setLoading(true);

    apiService.getCourses<StudentOwnCoursesResponse>(req).then((res) => {
      const {
        data: { total, courses },
      } = res;

      setData(courses);
      setLoading(false);
      setTotal(total);
    });

    return () => {};
  }, [pagination, query]);

  return (
    <AppLayout>
      <Row gutter={gutter}>
        <Col>
          <Input
            addonBefore={
              <Select defaultValue="name" onChange={(value: 'name' | 'type') => setSearchBy(value)}>
                <Select.Option value="name">Name</Select.Option>
                <Select.Option value="type">Category</Select.Option>
              </Select>
            }
            addonAfter={<SearchOutlined />}
            placeholder={`Search by ${searchBy}`}
            onChange={debouncedQuery}
          />
        </Col>
      </Row>

      <Table
        rowKey="id"
        dataSource={data}
        onChange={setPagination}
        loading={loading}
        pagination={{ ...pagination, total }}
        columns={columns}
      ></Table>
    </AppLayout>
  );
}
