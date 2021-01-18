import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import TextLink from 'antd/lib/typography/Link';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import ModalForm from '../../../../components/common/modal-form';
import { useDebounceSearch } from '../../../../components/custom-hooks/debounce-search';
import { useListEffect } from '../../../../components/custom-hooks/list-effect';
import Layout from '../../../../components/layout/layout';
import AddStudentForm from '../../../../components/students/add-student';
import { businessAreas } from '../../../../lib/constant';
import { BaseType, Student, StudentsRequest, StudentsResponse } from '../../../../lib/model';
import { CourseShort } from '../../../../lib/model/course';
import apiService from '../../../../lib/services/api-service';
import { genCommonTableProps } from '../../../../lib/util';

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
export default function Dashboard() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounceSearch(setQuery);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student>(null);
  const { data, loading, paginator, setPaginator, total, setTotal, setData } = useListEffect<
    StudentsRequest,
    StudentsResponse,
    Student
  >(apiService.getStudents.bind(apiService), 'students', true, { query });
  const columns: ColumnType<Student>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sortDirections: ['ascend', 'descend'],
      sorter: (pre: Student, next: Student) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);

        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      render: (_, record: Student) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'country',
      width: '10%',
      filters: businessAreas.map((item) => ({ text: item, value: item })),
      onFilter: (value: string, record: Student) => record.country.includes(value),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      width: '25%',
      render: (courses: CourseShort[]) => courses?.map((item) => item.name).join(','),
    },
    {
      title: 'Student Type',
      dataIndex: 'type',
      filters: [
        { text: 'developer', value: 'developer' },
        { text: 'tester', value: 'tester' },
      ],
      onFilter: (value: string, record: Student) => record.type.name === value,
      render: (type: BaseType) => type?.name,
    },
    {
      title: 'Join Time',
      dataIndex: 'ctime',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record: Student) => (
        <Space size="middle">
          <TextLink
            onClick={() => {
              setEditingStudent(record);
              setModalDisplay(true);
            }}
          >
            Edit
          </TextLink>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              apiService.deleteStudent(record.id).then((res) => {
                const { data: isDeleted } = res;

                if (isDeleted) {
                  const index = data.findIndex((item) => item.id === record.id);
                  const updatedData = [...data];

                  updatedData.splice(index, 1);
                  setData(updatedData);
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
  const cancel = () => {
    setModalDisplay(false);
    setEditingStudent(null);
  };

  return (
    <Layout>
      <FlexContainer>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalDisplay(true);
            setEditingStudent(null);
          }}
        >
          Add
        </Button>
        <Search
          placeholder="Search by name"
          onSearch={(value) => setQuery(value)}
          onChange={debouncedQuery}
        />
      </FlexContainer>
      <Table
        {...genCommonTableProps({
          data,
          paginator,
          loading,
          setPaginator,
          columns,
          total,
        })}
      ></Table>

      <ModalForm
        title={!!editingStudent ? 'Edit Student' : 'Add Student'}
        centered
        visible={isModalDisplay}
        cancel={cancel}
      >
        <AddStudentForm
          onFinish={(student: Student) => {
            /**
             * update local data if editing success
             */
            if (!!editingStudent) {
              const index = data.findIndex((item) => item.id === student.id);

              data[index] = student;
              setData([...data]);
            }

            setModalDisplay(false);
          }}
          student={editingStudent}
        />
      </ModalForm>
    </Layout>
  );
}
