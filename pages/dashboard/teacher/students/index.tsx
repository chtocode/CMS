import { Input, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import TextLink from 'antd/lib/typography/Link';
import Link from 'next/link';
import React from 'react';
import { useListEffect } from '../../../../components/custom-hooks/list-effect';
import AppLayout from '../../../../components/layout/layout';
import { CourseShort, Student, StudentsRequest, StudentsResponse } from '../../../../lib/model';
import apiService from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';
import { genCommonTableProps } from '../../../../lib/util';

export default function Page() {
  const { paginator, setPaginator, total, loading, data } = useListEffect<
    StudentsRequest,
    StudentsResponse,
    Student
  >(apiService.getStudents, 'students');
  const columns: ColumnsType<Student> = [
    { title: 'N.O', key: 'index', render: (_1, _2, index) => index + 1 },
    { title: 'name', dataIndex: 'name' },
    { title: 'country', dataIndex: 'country' },
    { title: 'email', dataIndex: 'email' },
    {
      title: 'course',
      dataIndex: 'courses',
      render: (ary: CourseShort[]) => (
        <>
          {ary.map((item) => (
            <Space key={item.id}>
              <Link href={`/dashboard/${storage.role}/courses/${item.courseId}`}>{item.name}</Link>
            </Space>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (_, record: Student) => (
        <Space size="middle">
          <TextLink
            onClick={() => {
              let msg = '';

              Modal.info({
                title: `Notify ${record.name}`,
                content: (
                  <Input
                    placeholder="Please input a message"
                    onChange={(event) => (msg = event.target.value)}
                  />
                ),
                onOk: (close) => {
                  // TODO: send notification to student;
                  close();
                },
              });
            }}
          >
            Notify
          </TextLink>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Table
        {...genCommonTableProps({ data, columns, loading, paginator, setPaginator, total })}
      ></Table>
    </AppLayout>
  );
}
