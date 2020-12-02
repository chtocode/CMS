import { Input, Popconfirm, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../../components/layout/layout';
import { Student } from '../../lib/model';
import apiService from '../../lib/services/api-service';

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

export default function Dashboard() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const columns: ColumnType<Student>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a['name'].localeCompare(b['name']),
    },
    {
      title: 'Area',
      dataIndex: 'address',
      width: '10%',
      filters: [
        { text: '加拿大', value: '加拿大' },
        { text: '澳洲', value: '澳洲' },
        { text: '国内', value: '国内' },
      ],
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'selectedCurriculm',
      width: '25%',
    },
    {
      title: 'Student Type',
      dataIndex: 'studentType',
      width: '15%',
      filters: [
        { text: '开发', value: '开发' },
        { text: '测试', value: '测试' },
      ],
    },
    {
      title: 'Join Time',
      dataIndex: 'joinTime',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record: Student) => (
        <Space size="middle">
          <Link href={''}>
            <a>Edit</a>
          </Link>

          <Popconfirm
            title="确定删除这个学生?"
            onConfirm={() => {}}
            okText="确定"
            cancelText="取消"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    apiService.getStudents().then((res) => {
      const {
        data: { students = [] },
      } = res;

      setData(students);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <Search placeholder="通过名称搜索" onSearch={() => {}} />

      <Table
        rowKey="id"
        dataSource={data}
        onChange={() => {}}
        loading={loading}
        pagination={pagination}
        columns={columns}
      ></Table>
    </Layout>
  );
}
