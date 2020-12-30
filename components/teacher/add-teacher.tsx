import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Slider } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { businessAreas, phone, SkillDes, validateMessages } from '../../lib/constant';
import { Skill, Teacher } from '../../lib/model';
import apiService from '../../lib/services/api-service';

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

export interface AddTeacherFormValues {
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  email: string;
}

export interface AddTeacherFormProps {
  onFinish?: (value: Teacher) => void;
  teacher?: Teacher;
}

const prefixSelector = (
  <Form.Item name="prefix" initialValue="86" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

export default function AddTeacherForm(props: AddTeacherFormProps): JSX.Element {
  const [form] = Form.useForm();
  const { onFinish, teacher } = props;

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      validateMessages={validateMessages}
      onFinish={(values) => {
        const response = !teacher
          ? apiService.addTeacher(values)
          : apiService.updateTeacher({ ...values, id: teacher.id });

        response.then((response) => {
          const { data } = response;

          if (onFinish && data) {
            onFinish(data);
          }
        });
      }}
      initialValues={{
        name: teacher?.name,
        email: teacher?.email,
        country: teacher?.country,
        phone: teacher?.phone,
        skills: teacher?.skills || [{ name: '', level: 2 }],
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="teacher name" />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
        <Input type="email" placeholder="email" />
      </Form.Item>

      <Form.Item label="Country" name="country" rules={[{ required: true }]}>
        <Select>
          {businessAreas.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true }, { pattern: phone }]}
      >
        <Input addonBefore={prefixSelector} placeholder="mobile phone" />
      </Form.Item>

      <Form.Item label={<b>Skills</b>}> </Form.Item>

      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row align="middle" justify="space-between" key={field.name}>
                <Col span={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    fieldKey={[field.fieldKey, 'name']}
                    rules={[{ required: true }]}
                  >
                    <Input style={{ textAlign: 'right' }} />
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'level']}
                    fieldKey={[field.fieldKey, 'level']}
                    initialValue={2}
                  >
                    <Slider
                      step={1}
                      min={1}
                      max={5}
                      tipFormatter={(value: number) => SkillDes[value]}
                    />
                  </Form.Item>
                </Col>

                <Col style={{ alignSelf: 'stretch' }}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ margin: '10px 0 0 10px', color: 'red' }}
                    />
                  )}
                </Col>
              </Row>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Skill
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

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
            {!!teacher ? 'Update' : 'Add'}
          </Button>
        )}
      </ModalFormSubmit>
    </Form>
  );
}
