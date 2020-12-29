import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Cascader,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Rate,
  Row,
  Select,
  Tag,
  Tooltip,
  Upload
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { FormListFieldData } from 'antd/lib/form/FormList';
import TextArea from 'antd/lib/input/TextArea';
import format from 'date-fns/format';
import React, { useEffect, useState } from 'react';
import DatePicker from '../../../components/common/date-picker';
import EditableItem from '../../../components/common/editable-text';
import { DescriptionsVerticalMiddle, FormItemNoMb } from '../../../components/common/styled';
import AppLayout from '../../../components/layout/layout';
import { Gender, gutter, programLanguageColors, skillDes } from '../../../lib/constant';
import { Country, Teacher, TeacherProfile } from '../../../lib/model';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { beforeUploadAvatar } from '../../../lib/util';
import addressOptions from '../../../public/address.json';

type Profile = TeacherProfile & Pick<Teacher, 'country' | 'email' | 'name' | 'phone' | 'skills'>;

export default function Page() {
  const [data, setData] = useState<Profile>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fileList, setFileList] = useState([]);
  const updateProfile = (value: Partial<Profile>) => {
    if (value.birthday) {
      value.birthday = format(new Date(value.birthday), 'yyyy-MM-dd');
    }

    apiService.updateProfile<Profile>(value).then((res) => {
      const { data } = res;

      if (!!data) {
        setData(data);
      }
    });
  };

  useEffect(() => {
    apiService.getProfileByUserId<Profile>(storage.userId).then((res) => {
      const { data } = res;

      setData(data);
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data.avatar,
        },
      ]);
    });

    apiService.getCountries().then((res) => {
      const { data } = res;

      setCountries(data);
    });
  }, []);

  return (
    <AppLayout>
      <Card
        title="My Profile"
        extra={
          <Tooltip title="Double click content to edit" placement="left">
            <QuestionCircleOutlined />
          </Tooltip>
        }
      >
        <ImgCrop rotate shape="round">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUploadAvatar}
            onChange={({ fileList: newFileList, file }) => {
              if (file?.response) {
                const { url } = file.response;

                updateProfile({ avatar: url as string });
              }
              setFileList(newFileList);
            }}
          >
            {!fileList.length && '+ Upload'}
          </Upload>
        </ImgCrop>

        <Divider />

        {data && (
          <>
            <DescriptionsVerticalMiddle title="Basic Info">
              <Descriptions.Item label="Name">
                <EditableItem allowEnterToSave onSave={updateProfile} textNode={data?.name}>
                  <FormItemNoMb initialValue={data?.name} rules={[{ required: true }]} name="name">
                    <Input />
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Birthday">
                <EditableItem textNode={data?.birthday} onSave={updateProfile}>
                  <FormItemNoMb name="birthday" initialValue={new Date(data?.birthday)}>
                    <DatePicker style={{ width: '100%' }} />
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Gender">
                <EditableItem textNode={Gender[data?.gender]} onSave={updateProfile}>
                  <FormItemNoMb name="gender">
                    <Radio.Group defaultValue={data.gender}>
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>FeMale</Radio>
                    </Radio.Group>
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                <EditableItem textNode={data?.phone} onSave={updateProfile}>
                  <FormItemNoMb
                    name="phone"
                    initialValue={data?.phone}
                    rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'Phone number invalid' }]}
                  >
                    <Input />
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              {/* email 暂时不支持更新 */}
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>

              <Descriptions.Item label="Country">
                <EditableItem textNode={data?.country} onSave={updateProfile}>
                  <FormItemNoMb name="country" initialValue={data?.country}>
                    <Select defaultValue={data?.country}>
                      {countries.map((item, index) => (
                        <Select.Option value={item.en} key={index}>
                          {item.en}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Address">
                <EditableItem textNode={data?.address} onSave={updateProfile}>
                  <FormItemNoMb name="address">
                    <Cascader
                      options={addressOptions}
                      fieldNames={{ label: 'name', value: 'name', children: 'children' }}
                    />
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>
            </DescriptionsVerticalMiddle>

            <Divider />

            <DescriptionsVerticalMiddle title="Other" column={6} layout="vertical">
              <Descriptions.Item label="Skills" span={3}>
                <EditableItem
                  textContainerStyles={{ width: '100%' }}
                  textNode={data?.skills.map((item, index) => (
                    <Row gutter={gutter}>
                      <Col span={4}>
                        <Tag
                          color={programLanguageColors[index]}
                          key={item.name}
                          style={{ padding: '5px 10px' }}
                        >
                          {item.name}
                        </Tag>
                      </Col>
                      <Col offset={1}>
                        <Rate value={item.level} tooltips={skillDes} count={5} disabled />
                      </Col>
                    </Row>
                  ))}
                  onSave={updateProfile}
                  initialValues={{ skills: data?.skills }}
                  layout="column"
                >
                  <Form.List name="skills">
                    {(fields: FormListFieldData[], { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={gutter} key={field.key}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'name']}
                                fieldKey={[field.fieldKey, 'name']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Skill Name" />
                              </Form.Item>
                            </Col>

                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'level']}
                                fieldKey={[field.fieldKey, 'level']}
                                rules={[{ required: true }]}
                              >
                                <Rate tooltips={skillDes} count={5} />
                              </Form.Item>
                            </Col>

                            <Col span={2}>
                              <FormItemNoMb>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(field.name);
                                    } else {
                                      message.warn('You must set at least one skill.');
                                    }
                                  }}
                                />
                              </FormItemNoMb>
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
                                Add Skill
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Intro" span={3}>
                <EditableItem textNode={data?.description} onSave={updateProfile} layout="column">
                  <FormItemNoMb name="description" initialValue={data?.description}>
                    <TextArea />
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>
            </DescriptionsVerticalMiddle>
          </>
        )}
      </Card>
    </AppLayout>
  );
}
