import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { debounce, omitBy } from 'lodash';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalForm from '../../../../components/common/modal-form';
import Layout from '../../../../components/layout/layout';
import { Skill, Teacher } from '../../../../lib/model';
import apiService from '../../../../lib/services/api-service';

const Search = styled(Input.Search)`
  width: 30%;
  display: block;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export default function Page() {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Partial<TablePaginationConfig>>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [total, setTotal] = useState(0);
  const columns: ColumnType<Teacher>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sortDirections: ['ascend', 'descend'],
      sorter: (pre: Teacher, next: Teacher) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);

        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      render: (_, record: Teacher) => (
        <Link href={`/dashboard/manager/teachers/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: '10%',
      filters: [
        { text: 'Canada', value: 'Canada' },
        { text: 'Australia', value: 'Australia' },
        { text: 'China', value: 'China' },
      ],
      onFilter: (value: string, record: Teacher) => record.country.includes(value),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Skill',
      dataIndex: 'skills',
      width: '25%',
      render: (skills: Skill[]) => skills?.map((item) => item.name).join(','),
    },
    {
      title: 'Course Amount',
      dataIndex: 'courseAmount',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record: Teacher) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditingTeacher(record);
              setModalDisplay(true);
            }}
          >
            Edit
          </a>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              //   apiService.deleteStudent({ id: record.id }).then((res) => {
              //     const { data: isDeleted } = res;
              //     if (isDeleted) {
              //       const index = data.findIndex((item) => item.id === record.id);
              //       const updatedData = [...data];
              //       updatedData.splice(index, 1);
              //       setData(updatedData);
              //       setTotal(total - 1);
              //     }
              //   });
            }}
            okText="Confirm"
            cancelText="Cancel"
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
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher>(null);
  const cancel = () => {
    setModalDisplay(false);
    setEditingTeacher(null);
  };

  useEffect(() => {
    const req = omitBy(
      { limit: pagination.pageSize, page: pagination.current, query },
      (item) => item === ''
    );

    apiService.getTeachers(req).then((res) => {
      const { teachers, total } = res.data;

      setData(teachers);
      setTotal(total);
      setLoading(false);
    });
  }, [query, pagination]);

  return (
    <Layout>
      <FlexContainer>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalDisplay(true);
            setEditingTeacher(null);
          }}
        >
          Add
        </Button>
        <Search
          placeholder="通过名称搜索"
          onSearch={(value) => setQuery(value)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            debouncedQuery(event.target.value);
          }}
        />
      </FlexContainer>
      <Table
        rowKey="id"
        dataSource={data}
        onChange={setPagination}
        loading={loading}
        pagination={{ ...pagination, total }}
        columns={columns}
      ></Table>

      <ModalForm
        title={!!editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        centered
        visible={isModalDisplay}
        cancel={cancel}
      >
        {/* <AddStudentForm
          onFinish={(student: Teacher) => {
            /**
             * update local data if editing success
             */
        /*if (!!editingStudent) {
              const index = data.findIndex((item) => item.id === student.id);

              data[index] = student;
              setData([...data]);
            }

            setModalDisplay(false);
          }}
          student={editingStudent}
        /> */}
      </ModalForm>
    </Layout>
  );
}
