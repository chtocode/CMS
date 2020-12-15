import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select } from 'antd';
import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { gutter, validateMessages, weekDays } from '../../lib/constant';
import { ProcessRequest } from '../../lib/model';
import apiService from '../../lib/services/api-service';
import TimePicker from '../common/time-picker';

export interface AddChapterFormProps {
  courseId?: number;
  processId?: number;
  onSuccess?: (res: boolean) => void;
  isAdd?: boolean;
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
    time: Date;
  }[];
};

export default function UpdateChapterForm({
  courseId,
  onSuccess,
  processId,
  isAdd = true,
}: AddChapterFormProps) {
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
    if (!courseId && !processId) {
      message.error('You must select a course to update!');
      return;
    }

    const { classTime: origin, chapters } = values;
    const classTime = origin.map(({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`);
    const req: ProcessRequest = { chapters, classTime, processId, courseId };

    apiService.updateProcess(req).then((res) => {
      const { data } = res;

      if (!!onSuccess && data) {
        onSuccess(true);
      }
    });
  };
  const initialValues = {
    [cpts]: [{ name: '', content: '' }],
    [clsTime]: [{ weekday: '', time: '' }],
  };

  useEffect(() => {
    (async () => {
      if (!processId || isAdd) {
        return;
      }

      const { data } = await apiService.getProcessById(processId);

      if (!!data) {
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: new Date(`2020-11-11 ${time}`) }; // 日期无所谓，随便设置的
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
        setSelectedWeekdays(classTimes.map((item) => item.weekday));
      }
    })();
  }, [processId]);

  return (
    <Form
      form={form}
      name="process"
      onFinish={onFinish}
      autoComplete="off"
      validateMessages={validateMessages}
      style={{ padding: '0 1.6%' }}
      initialValues={initialValues}
    >
      <Row gutter={gutter}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List name={cpts}>
            {(fields, { add, remove }) => (
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
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime">
            {(fields: FormListFieldData[], { add, remove }) => (
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
                            <Option key={day} value={day} disabled={selectedWeekdays.includes(day)}>
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
            )}
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
