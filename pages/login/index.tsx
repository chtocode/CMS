import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Typography } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Role } from '../../lib/constant';
import { LoginFormValues } from '../../lib/model/login';
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';

const { Title } = Typography;

const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

const StyledTitle = styled(Title)`
  &&& {
    text-align: center;
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
    <Row justify="center" style={{ marginTop: '5%' }}>
      <Col span={8}>
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={(values: LoginFormValues) => login(values)}
          form={form}
        >
          <StyledTitle>课程管理助手</StyledTitle>
          <Form.Item
            name="loginType"
            initialValue="student"
            rules={[
              {
                required: true,
                message: 'Please choose a login type',
              },
            ]}
          >
            <Radio.Group
              onChange={(event: RadioChangeEvent) => {
                const loginType = event.target.value;

                form.resetFields();
                form.setFieldsValue({ loginType });
              }}
            >
              <Radio.Button value={Role.student}>Student</Radio.Button>
              <Radio.Button value={Role.teacher}>Teacher</Radio.Button>
              <Radio.Button value={Role.manager}>Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: '请输入您的邮箱',
              },
              {
                type: 'email',
                message: '邮箱格式错误',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} type="email" placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入您的密码',
              },
              {
                min: 4,
                max: 16,
                message: '密码长度错误',
              },
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              登录
            </StyledButton>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
