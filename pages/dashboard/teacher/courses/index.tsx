import { Col, Input, Popconfirm, Rate, Row, Space, Switch, Table, Tooltip } from 'antd';
import { ColumnType } from 'antd/lib/table';
import TextLink from 'antd/lib/typography/Link';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDebounceSearch } from '../../../../components/custom-hooks/debounce-search';
import AppLayout from '../../../../components/layout/layout';
import { CourseStatusText, DurationUnit, gutter } from '../../../../lib/constant';
import { Course } from '../../../../lib/model';
import apiService from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';
import { ScrollMode, useCourses } from '../../manager/courses';

export function TableMode({ query }: { query?: string }) {
  const { courses, setPaginator, paginator, setCourses, total, setTotal } = useCourses(query);
  const columns: ColumnType<Course>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'name',
      dataIndex: 'name',
      render: (name: string, record) => (
        <Link href={`/dashboard/${storage.role}/courses/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'typeName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => CourseStatusText[value],
    },
    {
      title: 'Star',
      dataIndex: 'star',
      render: (value: number) => <Rate value={value} disabled />,
    },
    {
      title: 'StartTime',
      dataIndex: 'startTime',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: (value, record) => value + DurationUnit[record.durationUnit],
    },
    {
      title: 'Create time',
      dataIndex: 'ctime',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (_, record: Course) => (
        <Space size="middle">
          <Link href={`/dashboard/${storage.role}/courses/edit-course?uid=${record.uid}`}>
            Edit
          </Link>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              apiService.deleteCourse(record.id).then((res) => {
                const { data: isDeleted } = res;

                if (isDeleted) {
                  const index = courses.findIndex((item) => item.id === record.id);
                  const updatedData = [...courses];

                  updatedData.splice(index, 1);
                  setCourses(updatedData);
                  setTotal(total - 1);
                }
              });
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <TextLink>Delete</TextLink>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={gutter}></Row>

      <Table
        rowKey="id"
        dataSource={courses}
        columns={columns}
        onChange={({ pageSize, current }) => {
          setPaginator({ page: current, limit: pageSize });
        }}
        pagination={{ current: paginator.page, pageSize: paginator.limit, showSizeChanger: true }}
      />
    </>
  );
}

export default function Page() {
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const debounceQuery = useDebounceSearch(setQuery);

  return (
    <AppLayout>
      <Row justify="space-between">
        <Col span={4}>
          {!isScroll && (
            <Input.Search
              placeholder="Search by name"
              onSearch={setQuery}
              onChange={debounceQuery}
            ></Input.Search>
          )}
        </Col>

        <Col>
          <Tooltip title="switch to grid mode">
            <Switch checkedChildren="on" unCheckedChildren="off" onChange={setIsScroll} />
          </Tooltip>
        </Col>
      </Row>

      {isScroll ? <ScrollMode /> : <TableMode query={query} />}
    </AppLayout>
  );
}
