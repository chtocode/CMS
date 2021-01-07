import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import TextLink from 'antd/lib/typography/Link';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import ModalForm from '../../../../components/common/modal-form';
import { useDebounceSearch } from '../../../../components/custom-hooks/debounce-search';
import { useListEffect } from '../../../../components/custom-hooks/list-effect';
import Layout from '../../../../components/layout/layout';
import AddTeacherForm from '../../../../components/teacher/add-teacher';
import { businessAreas } from '../../../../lib/constant';
import { Skill, Teacher, TeachersRequest, TeachersResponse } from '../../../../lib/model';
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

export default function Page() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounceSearch(setQuery);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher>(null);
  const { paginator, setPaginator, total, data, setData, loading, setTotal } = useListEffect<
    TeachersRequest,
    TeachersResponse,
    Teacher
  >(apiService.getTeachers.bind(apiService), 'teachers', true, { query });
  const cancel = () => {
    setModalDisplay(false);
    setEditingTeacher(null);
  };
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
      filters: businessAreas.map((item) => ({ text: item, value: item })),
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
          <TextLink
            onClick={() => {
              setEditingTeacher(record);
              setModalDisplay(true);
            }}
          >
            Edit
          </TextLink>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              apiService.deleteTeacher({ id: record.id }).then((res) => {
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
        <Search placeholder="通过名称搜索" onSearch={setQuery} onChange={debouncedQuery} />
      </FlexContainer>
      <Table
        {...genCommonTableProps({ data, total, columns, paginator, setPaginator, loading })}
      ></Table>

      <ModalForm
        title={!!editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        centered
        visible={isModalDisplay}
        cancel={cancel}
      >
        <AddTeacherForm
          onFinish={(teacher: Teacher) => {
            /**
             * update local data if editing success
             */
            if (!!editingTeacher) {
              const index = data.findIndex((item) => item.id === teacher.id);

              data[index] = teacher;
              setData([...data]);
            } else {
              setData([...data, teacher]);
            }

            setModalDisplay(false);
          }}
          teacher={editingTeacher}
        />
      </ModalForm>
    </Layout>
  );
}
