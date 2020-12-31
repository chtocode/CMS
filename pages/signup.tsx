import { UserOutlined } from '@ant-design/icons';
import { Col, Form, Input, Radio, Row, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { omit } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Header from '../components/home/header';
import { Role, validateMessages } from '../lib/constant';
import { RegisterFormValues } from '../lib/model';
import apiService from '../lib/services/api-service';
import { StyledButton, StyledTitle } from './login';

export default function Page() {
  const [form] = useForm();
  const router = useRouter();
  const signUp = async (values: RegisterFormValues) => {
    const req = omit(values, 'confirmPassword');
    const { data } = await apiService.signUp(req);

    if (!!data) {
      router.push('login');
    }
  };

  return (
    <>
      <Header />

      <StyledTitle>Sign up your account</StyledTitle>

      <Row justify="center">
        <Col md={8} sm={24}>
          <Form
            name="signUp"
            initialValues={{
              remember: true,
            }}
            onFinish={(values: RegisterFormValues) => signUp(values)}
            form={form}
            layout="vertical"
            validateMessages={validateMessages}
          >
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={Role.student}>Student</Radio>
                <Radio value={Role.teacher}>Teacher</Radio>
                <Radio value={Role.manager}>Manager</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="email" label="email" rules={[{ required: true }, { type: 'email' }]}>
              <Input prefix={<UserOutlined />} type="email" placeholder="Please input email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }, { min: 4, max: 16 }]}
            >
              <Input.Password placeholder="please input password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Tap password again" />
            </Form.Item>

            <Form.Item>
              <StyledButton type="primary" htmlType="submit">
                Sign Up
              </StyledButton>
            </Form.Item>
          </Form>

          <Space>
            <span>Already have an account?</span>
            <Link href="/login">Sign in</Link>
          </Space>
        </Col>
      </Row>
    </>
  );
}
