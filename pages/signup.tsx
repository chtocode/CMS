import { UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { omit } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Role, validateMessages } from '../lib/constant';
import { RegisterFormValues } from '../lib/model';
import apiService from '../lib/services/api-service';

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
    <Row justify="center" style={{ marginTop: '5%' }}>
      <Col span={8}>
        <Typography.Title style={{ textAlign: 'center' }}>Sign up your account</Typography.Title>
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
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Space>
          <span>Already have an account?</span>
          <Link href="/login">Sign in</Link>
        </Space>
      </Col>
    </Row>
  );
}
