import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Table, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDebounceSearch } from '../../../../components/custom-hooks/debounce-search';
import { useListEffect } from '../../../../components/custom-hooks/list-effect';
import AppLayout from '../../../../components/layout/layout';
import {
  CourseStatusColor,
  CourseStatusText,
  DurationUnit,
  gutter
} from '../../../../lib/constant';
import { CourseRequest, StudentCourse, StudentOwnCoursesResponse } from '../../../../lib/model';
import { apiService } from '../../../../lib/services/api-service';
import { genCommonTableProps } from '../../../../lib/util';

export default function Page() {
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
  const { data, total, paginator, loading, setPaginator } = useListEffect<
    Partial<CourseRequest>,
    StudentOwnCoursesResponse,
    StudentCourse
  >(apiService.getCourses.bind(apiService), 'courses', true, { [searchBy]: query, own: true });

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
        {...genCommonTableProps({ data, loading, columns, paginator, setPaginator, total })}
      ></Table>
    </AppLayout>
  );
}
