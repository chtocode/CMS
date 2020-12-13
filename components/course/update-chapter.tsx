import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select, TimePicker } from 'antd';
import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { gutter, validateMessages, weekDays } from '../../lib/constant';
import { ProcessRequest } from '../../lib/model';
import apiService from '../../lib/services/api-service';

export interface AddChapterFormProps {
  courseId?: number;
  processId?: number;
  onSuccess?: (res: boolean) => void;
}

const { Option } = Select;
const clsTime = 'classTime';
const cpts = 'chapters';

type ChapterFormValue = {
  [cpts]: {
    name: string;
    content: string;
  }[];
  [clsTime]: {
    weekday: string;
    time: Moment;
  }[];
};

export default function UpdateChapterForm({ courseId, onSuccess, processId }: AddChapterFormProps) {
  const [form] = useForm<ChapterFormValue>();
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const updateSelectedWeekdays = (namePath?: (string | number)[]) => {
    const selected: {
      weekday: string;
      time: string;
    }[] = form.getFieldValue(clsTime) || [];
    let result = selected.map((item) => item.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }

    setSelectedWeekdays(result);
  };
  const onFinish = (values: ChapterFormValue) => {
    const { classTime: origin, chapters } = values;
    const classTime = origin.map(({ weekday, time }) => `${weekday} ${time.format('hh:mm:ss')}`);
    const req: ProcessRequest = { chapters, classTime, processId, courseId };

    apiService.updateProcess(req).then((res) => {
      const { data } = res;

      if (!!onSuccess && data) {
        onSuccess(true);
      }
    });
  };
  let initDetail: () => void = null;
  let initClassTime: () => void = null;

  useEffect(() => {
    const classTime = form.getFieldValue(clsTime);
    const chapters = form.getFieldValue(cpts);

    if (!chapters?.length) {
      initDetail();
    }

    if (!classTime?.length) {
      initClassTime();
    }
  }, []);

  return (
    <Form
      form={form}
      name="process"
      onFinish={onFinish}
      autoComplete="off"
      validateMessages={validateMessages}
      style={{ padding: '0 1.6%' }}
    >
      <Row gutter={gutter}>
        <Col span={12}>
          <Form.List name={cpts}>
            {(fields, { add, remove }) => {
              if (!initDetail) {
                initDetail = add;
              }

              return (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'content']}
                          fieldKey={[field.fieldKey, 'content']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter content" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <FormItem>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.warn('You must set at least one chapter.');
                              }
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Chapter
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.List>
        </Col>

        <Col span={12}>
          <Form.List name="classTime">
            {(fields: FormListFieldData[], { add, remove }) => {
              if (!initClassTime) {
                initClassTime = add;
              }

              return (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'weekday']}
                          fieldKey={[field.fieldKey, 'weekday']}
                          rules={[{ required: true }]}
                        >
                          <Select size="large">
                            {weekDays.map((day) => (
                              <Option
                                key={day}
                                value={day}
                                disabled={selectedWeekdays.includes(day)}
                              >
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'time']}
                          fieldKey={[field.fieldKey, 'time']}
                          rules={[{ required: true }]}
                        >
                          <TimePicker size="large" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <FormItem>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                updateSelectedWeekdays([clsTime, field.name, 'weekday']);
                                remove(field.name);
                              } else {
                                message.warn('You must set at least one class time.');
                              }
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          disabled={fields.length >= 7}
                          onClick={() => {
                            updateSelectedWeekdays();
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Class Time
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
