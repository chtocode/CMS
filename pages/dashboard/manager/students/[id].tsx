import { Card, Col, Row, Tabs, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Table, { ColumnType } from 'antd/lib/table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../../../../components/layout/layout';
import { programLanguageColors } from '../../../../lib/constant';
import { StudentResponse } from '../../../../lib/model';
import { Course } from '../../../../lib/model/course';
import apiService from '../../../../lib/services/api-service';

export const H3 = styled.h3`
  color: #7356f1;
  margin: 20px 0px;
  font-size: 24px;
`;

export async function getServerSideProps(context) {
  // todo get student profile here;
  const { id } = context.params;
  
  return {
    props: { id: id },
  };
}

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>([]);
  const [about, setAbout] = useState<{ label: string; value: string | number }[]>([]);
  const [data, setData] = useState<StudentResponse>(null);
  const columns: ColumnType<Course>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => <Link href={`/dashboard/course/${record.id}`}>{value}</Link>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Join Time',
      dataIndex: 'ctime',
    },
  ];

  useEffect(() => {
    (async () => {
      const id = +router.query.id || props.id;
      const { data } = await apiService.getStudentById(id);
      const info = [
        { label: 'Name', value: data.name },
        { label: 'Age', value: data.age },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
      ];
      const about = [
        { label: 'Eduction', value: data.education },
        { label: 'Area', value: data.country },
        { label: 'Gender', value: data.gender === 1 ? 'Male' : 'Female' },
        { label: 'Member Period', value: data.memberStartAt + ' - ' + data.memberEndAt },
        { label: 'Type', value: data.typeName },
        { label: 'Create Time', value: data.ctime },
        { label: 'Update Time', value: data.updateAt },
      ];

      setInfo(info);
      setCourses(data.courses);
      setAbout(about);
      setData(data);
    })();
  }, []);

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.avatar}
                style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
              />
            }
          >
            <Row gutter={[6, 16]}>
              {info.map((item) => (
                <Col span={12} key={item.label} style={{ textAlign: 'center' }}>
                  <b>{item.label}</b>
                  <p>{item.value}</p>
                </Col>
              ))}
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <b>Address</b>
                <p>{data?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <H3>Information</H3>

                <Row gutter={[6, 16]}>
                  {about.map((item) => (
                    <Col span={24} key={item.label}>
                      <b style={{ marginRight: 16, minWidth: 150, display: 'inline-block' }}>
                        {item.label}:
                      </b>
                      <span>{item.value}</span>
                    </Col>
                  ))}
                </Row>

                <H3>Interesting</H3>

                <Row gutter={[6, 16]}>
                  <Col>
                    {data?.interest.map((item, index) => (
                      <Tag color={programLanguageColors[index]} key={item} style={{ padding: '5px 10px' }}>
                        {item}
                      </Tag>
                    ))}
                  </Col>
                </Row>

                <H3>Description</H3>

                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>{data?.description}</Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Courses" key="2">
                <Table dataSource={courses} columns={columns} rowKey="id"></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
