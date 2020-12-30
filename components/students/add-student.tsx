import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { businessAreas, validateMessages } from '../../lib/constant';
import { Student } from '../../lib/model';
import apiService from '../../lib/services/api-service';

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

export interface AddStudentFormValues {
  name: string;
  country: string;
  type: number;
  email: string;
}

export interface AddStudentFormProps {
  onFinish?: (value: Student) => void;
  student?: Student;
}

export default function AddStudentForm(props: AddStudentFormProps): JSX.Element {
  const [form] = Form.useForm();
  const { onFinish, student } = props;

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      validateMessages={validateMessages}
      onFinish={(values) => {
        const response = !student
          ? apiService.addStudent(values)
          : apiService.updateStudent({ ...values, id: student.id });

        response.then((response) => {
          const { data } = response;

          if (onFinish && data) {
            onFinish(data);
          }
        });
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        country: student?.country,
        typeId: student?.typeId,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="student name" />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
        <Input type="email" placeholder="email" />
      </Form.Item>

      <Form.Item label="Area" name="country" rules={[{ required: true }]}>
        <Select>
          {businessAreas.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Student Type" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>Tester</Select.Option>
          <Select.Option value={2}>Developer</Select.Option>
        </Select>
      </Form.Item>

      {/**
       * Antd BUG: https://github.com/ant-design/ant-design/issues/28208
       * email 必须touched后表单状态才符合预期
       */}
      <ModalFormSubmit shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            // disabled={
            //   !form.isFieldsTouched(true) ||
            //   !!form.getFieldsError().filter(({ errors }) => errors.length).length
            // }
          >
            {!!student ? 'Update' : 'Add'}
          </Button>
        )}
      </ModalFormSubmit>
    </Form>
  );
}
