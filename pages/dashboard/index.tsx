import { Input, Popconfirm, Space, Table } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { debounce, omitBy } from 'lodash';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  const [pagination, setPagination] = useState<Partial<TablePaginationConfig>>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [total, setTotal] = useState(0);
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
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useCallback(
    debounce((nextValue) => setQuery(nextValue), 1000),
    []
  );

  useEffect(() => {
    const req = omitBy(
      { limit: pagination.pageSize, page: pagination.current, query },
      (item) => item === ''
    );

    apiService.getStudents(req).then((res) => {
      const {
        students,
        total,
      } = res.data;

      setData(students);
      setTotal(total);
      setLoading(false);
    });
  }, [query, pagination]);

  return (
    <Layout>
      <Search
        placeholder="通过名称搜索"
        onSearch={(value) => setQuery(value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          debouncedQuery(event.target.value);
        }}
      />

      <Table
        rowKey="id"
        dataSource={data}
        onChange={setPagination}
        loading={loading}
        pagination={{ ...pagination, total }}
        columns={columns}
      ></Table>
    </Layout>
  );
}
