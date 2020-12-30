import { Input, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import TextLink from 'antd/lib/typography/Link';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../../components/layout/layout';
import { CourseShort, Student } from '../../../../lib/model';
import apiService from '../../../../lib/services/api-service';
import storage from '../../../../lib/services/storage';

export default function Page() {
  const [data, setData] = useState<Student[]>(null);
  const [total, setTotal] = useState<number>(0);
  const [paginator, setPaginator] = useState({ page: 1, limit: 20 });
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
              <Link href={`/dashboard/${storage.role}/courses/${item.courseId}`}>
                {item.name}
              </Link>
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

  useEffect(() => {
    const req = { ...paginator, userId: storage.userId };

    apiService.getStudents(req).then((res) => {
      const {
        data: { total, students },
      } = res;

      setData(students);
      setTotal(total);
    });

    return () => {};
  }, [paginator]);

  return (
    <AppLayout>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        onChange={({ pageSize, current }) => {
          setPaginator({ page: current, limit: pageSize });
        }}
        pagination={{
          pageSize: paginator.limit,
          current: paginator.page,
          total,
          showSizeChanger: true,
        }}
      ></Table>
    </AppLayout>
  );
}
