import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import Header from '../components/home/header';
import { Role, validateMessages } from '../lib/constant';
import { LoginFormValues } from '../lib/model/login';
import apiService from '../lib/services/api-service';
import storage from '../lib/services/storage';

const { Title } = Typography;

export const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

export const StyledTitle = styled(Title)`
  text-align: center;
  margin: 0.5em 0;
  @media (max-width: 700px) {
    margin-top: 2em;
    font-size: 18px !important;
    padding-bottom: 0;
  }
`;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const login = async (loginRequest: LoginFormValues) => {
    const { data } = await apiService.login(loginRequest);

    if (!!data) {
      storage.setUserInfo(data);
      router.push('dashboard');
    }
  };

  return (
    <>
      <Header />

      <StyledTitle>Course Management Assistant</StyledTitle>

      <Row justify="center">
        <Col md={8} sm={24}>
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            onFinish={(values: LoginFormValues) => login(values)}
            form={form}
            validateMessages={validateMessages}
          >
            <Form.Item name="role" initialValue={Role.student} rules={[{ required: true }]}>
              <Radio.Group
                onChange={(event: RadioChangeEvent) => {
                  const role = event.target.value;

                  form.resetFields();
                  form.setFieldsValue({ role });
                }}
              >
                <Radio.Button value={Role.student}>Student</Radio.Button>
                <Radio.Button value={Role.teacher}>Teacher</Radio.Button>
                <Radio.Button value={Role.manager}>Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
              <Input prefix={<UserOutlined />} type="email" placeholder="Please input email" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true }, { min: 4, max: 16 }]}>
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Please input password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <StyledButton type="primary" htmlType="submit">
                Sign in
              </StyledButton>
            </Form.Item>
          </Form>

          <Space>
            <span>No account?</span>
            <Link href="/signup">Sign up</Link>
          </Space>
        </Col>
      </Row>
    </>
  );
}
