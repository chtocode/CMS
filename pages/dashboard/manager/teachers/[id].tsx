import { HeartFilled } from '@ant-design/icons';
import { Avatar, Card, Col, List, Rate, Row, Tabs } from 'antd';
import Table, { ColumnType } from 'antd/lib/table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../../../../components/layout/layout';
import { Gender, gutter } from '../../../../lib/constant';
import { TeacherResponse } from '../../../../lib/model';
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
    props: { id },
  };
}

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>([]);
  const [about, setAbout] = useState<{ label: string; value: string | number }[]>([]);
  const [data, setData] = useState<TeacherResponse>(null);
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
      title: 'Start Time',
      dataIndex: 'startTime',
    },
    {
      title: 'Create Time',
      dataIndex: 'ctime',
    },
    {
      title: 'Enjoy',
      dataIndex: 'star',
      render: (value) => (
        <Rate character={<HeartFilled />} defaultValue={value} disabled style={{ color: 'red' }} />
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      const id = +router.query.id || props.id;
      const { data } = await apiService.getTeacherById(id);
      const { profile } = data;
      const info = [
        { label: 'Name', value: data.name },
        { label: 'Country', value: data.country },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
      ];
      const about = [
        { label: 'Birthday', value: profile?.birthday },
        { label: 'Gender', value: Gender[profile?.gender] },
        { label: 'Create Time', value: data.ctime },
        { label: 'Update Time', value: data.updateAt },
      ];

      setInfo(info);
      setAbout(about);
      setData(data);
    })();
  }, []);

  return (
    <Layout>
      <Row gutter={gutter}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.profile?.avatar}
                style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
              />
            }
          >
            <Row gutter={gutter}>
              {info.map((item) => (
                <Col span={12} key={item.label} style={{ textAlign: 'center' }}>
                  <b>{item.label}</b>
                  <p>{item.value}</p>
                </Col>
              ))}
            </Row>
            <Row gutter={gutter}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <b>Address</b>
                <p>{data?.profile?.address?.join(' ')}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <H3>Information</H3>

                <Row gutter={gutter}>
                  {about.map((item) => (
                    <Col span={24} key={item.label}>
                      <b style={{ marginRight: 16, minWidth: 150, display: 'inline-block' }}>
                        {item.label}:
                      </b>
                      <span>{item.value}</span>
                    </Col>
                  ))}
                </Row>

                <H3>Skills</H3>

                {data?.skills.map((item, index) => (
                  <Row key={index} gutter={gutter} align="middle">
                    <Col span={4}>
                      <b>{item.name}:</b>
                    </Col>
                    <Col>
                      <Rate disabled defaultValue={item.level} />
                    </Col>
                  </Row>
                ))}

                <H3>Description</H3>

                <Row gutter={gutter}>
                  <Col style={{ lineHeight: 2 }}>{data?.profile?.description}</Col>
                </Row>

                <H3>Education</H3>

                <List>
                  {data?.profile?.education?.map((item, index) => (
                    <List.Item extra={item.degree} key={index}>
                      <List.Item.Meta
                        title={item.startEnd.replace(' ', ' To ')}
                        description={item.level}
                      ></List.Item.Meta>
                    </List.Item>
                  ))}
                </List>

                <H3>Work Experience</H3>
                <List>
                  {data?.profile?.workExperience?.map((item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        title={item.startEnd.replace(' ', ' To ')}
                        description={
                          <Row>
                            <Col span={4}>
                              <b>{item.company}</b>
                            </Col>
                            <Col offset={1}>{item.post}</Col>
                          </Row>
                        }
                      ></List.Item.Meta>
                    </List.Item>
                  ))}
                </List>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Courses" key="2">
                <Table dataSource={data?.courses} columns={columns} rowKey="id"></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
