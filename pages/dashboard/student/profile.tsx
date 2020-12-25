import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Card,
  Cascader,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Tag,
  Tooltip,
  Upload
} from 'antd';
import ImgCrop from 'antd-img-crop';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EditableItem from '../../../components/common/editable-text';
import AppLayout from '../../../components/layout/layout';
import { Gender, interestColors } from '../../../lib/constant';
import { Country, Degree, StudentProfile } from '../../../lib/model';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import addressOptions from '../../../public/address.json';

const FormItem = styled(Form.Item)`
  margin-bottom: 0;
`;

const IDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    align-items: center;
  }
`;

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

export default function Page() {
  const [data, setData] = useState<StudentProfile>(null);
  const [existInterests, setExistInterests] = useState<string[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fileList, setFileList] = useState([]);
  const updateProfile = (value: Partial<StudentProfile>) => {
    apiService.updateProfile<StudentProfile>(value).then((res) => {
      const { data } = res;

      if (!!data) {
        setData(data);
      }
    });
  };

  useEffect(() => {
    apiService.getProfileByUserId<StudentProfile>(storage.userId).then((res) => {
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

    apiService.getAllInterestLanguages().then((res) => {
      const { data } = res;

      setExistInterests(data);
    });

    apiService.getDegrees().then((res) => {
      const { data } = res;

      setDegrees(data);
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
            beforeUpload={beforeUpload}
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
            <IDescriptions title="Basic Info">
              <Descriptions.Item label="Name">
                <EditableItem allowEnterToSave onSave={updateProfile} textNode={data?.name}>
                  <FormItem initialValue={data?.name} rules={[{ required: true }]} name="name">
                    <Input />
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Age">
                <EditableItem textNode={data?.age} onSave={updateProfile}>
                  <FormItem name="age" initialValue={data?.age}>
                    <InputNumber min={0} max={100} />
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Gender">
                <EditableItem textNode={Gender[data?.gender]} onSave={updateProfile}>
                  <FormItem name="gender">
                    <Radio.Group defaultValue={data.gender}>
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>FeMale</Radio>
                    </Radio.Group>
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                <EditableItem textNode={data?.phone} onSave={updateProfile}>
                  <FormItem
                    name="phone"
                    initialValue={data?.phone}
                    rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'Phone number invalid' }]}
                  >
                    <Input />
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              {/* email 暂时不支持更新 */}
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>

              <Descriptions.Item label="Country">
                <EditableItem textNode={data?.country} onSave={updateProfile}>
                  <FormItem name="country" initialValue={data?.country}>
                    <Select defaultValue={data?.country}>
                      {countries.map((item, index) => (
                        <Select.Option value={item.en} key={index}>
                          {item.en}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Address">
                <EditableItem textNode={data?.address} onSave={updateProfile}>
                  <FormItem name="address">
                    <Cascader
                      options={addressOptions}
                      fieldNames={{ label: 'name', value: 'name', children: 'children' }}
                    />
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>
            </IDescriptions>

            <Divider />

            {/* 会员时长禁止更新, 必须由系统生成 */}
            <IDescriptions title="Member">
              <Descriptions.Item label="Duration">
                From: {data.memberStartAt} To: {data.memberEndAt}
              </Descriptions.Item>
            </IDescriptions>

            <Divider />

            <IDescriptions title="Other" column={6}>
              <Descriptions.Item label="Degree" span={2}>
                <EditableItem textNode={data?.education} onSave={updateProfile}>
                  <FormItem name="eduction" initialValue={data?.education}>
                    <Select defaultValue={data?.education} style={{ minWidth: 100 }}>
                      {degrees.map((item, index) => (
                        <Select.Option value={item.short} key={index}>
                          {item.short}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Interest" span={4}>
                <EditableItem
                  textNode={data?.interest.map((item, index) => (
                    <Tag color={interestColors[index]} key={item} style={{ padding: '5px 10px' }}>
                      {item}
                    </Tag>
                  ))}
                  onSave={updateProfile}
                >
                  <FormItem name="interest" initialValue={data?.interest}>
                    <Select
                      mode="tags"
                      placeholder="select one interest language"
                      defaultValue={data?.interest}
                      style={{ minWidth: '10em' }}
                    >
                      {existInterests.map((item, index) => (
                        <Select.Option value={item} key={index}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Intro">
                <EditableItem textNode={data?.description} onSave={updateProfile}>
                  <FormItem name="description" initialValue={data?.description}>
                    <TextArea style={{ minWidth: '50vw' }} />
                  </FormItem>
                </EditableItem>
              </Descriptions.Item>
            </IDescriptions>
          </>
        )}
      </Card>
    </AppLayout>
  );
}
