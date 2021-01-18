import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Card,
  Cascader,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  Radio,
  Select,
  Tag,
  Tooltip,
  Upload
} from 'antd';
import ImgCrop from 'antd-img-crop';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import EditableItem from '../../../components/common/editable-text';
import { DescriptionsVerticalMiddle, FormItemNoMb } from '../../../components/common/styled';
import AppLayout from '../../../components/layout/layout';
import { Gender, programLanguageColors } from '../../../lib/constant';
import { BaseType, Country, Degree, StudentProfile } from '../../../lib/model';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { beforeUploadAvatar } from '../../../lib/util';
import addressOptions from '../../../public/address.json';

export default function Page() {
  const [data, setData] = useState<StudentProfile>(null);
  const [existInterests, setExistInterests] = useState<BaseType[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fileList, setFileList] = useState([]);
  const updateProfile = (value: Partial<StudentProfile>) => {
    apiService
      .updateProfile<StudentProfile>({ id: data.id, ...value })
      .then((res) => {
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

              <Descriptions.Item label="Age">
                <EditableItem textNode={data?.age} onSave={updateProfile}>
                  <FormItemNoMb name="age" initialValue={data?.age}>
                    <InputNumber min={0} max={100} />
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

            {/* 会员时长禁止更新, 必须由系统生成 */}
            <DescriptionsVerticalMiddle title="Member">
              <Descriptions.Item label="Duration">
                From: {data.memberStartAt} To: {data.memberEndAt}
              </Descriptions.Item>
            </DescriptionsVerticalMiddle>

            <Divider />

            <DescriptionsVerticalMiddle title="Other" column={6}>
              <Descriptions.Item label="Degree" span={2}>
                <EditableItem textNode={data?.education} onSave={updateProfile}>
                  <FormItemNoMb name="education" initialValue={data?.education}>
                    <Select defaultValue={data?.education} style={{ minWidth: 100 }}>
                      {degrees.map((item, index) => (
                        <Select.Option value={item.short} key={index}>
                          {item.short}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Interest" span={4}>
                <EditableItem
                  textNode={data?.interest.map((item, index) => (
                    <Tag
                      color={programLanguageColors[index]}
                      key={item}
                      style={{ padding: '5px 10px' }}
                    >
                      {item}
                    </Tag>
                  ))}
                  onSave={updateProfile}
                >
                  <FormItemNoMb name="interest" initialValue={data?.interest}>
                    <Select
                      mode="tags"
                      placeholder="select one interest language"
                      defaultValue={data?.interest}
                      style={{ minWidth: '10em' }}
                    >
                      {existInterests.map((item, index) => (
                        <Select.Option value={item.name} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItemNoMb>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Intro">
                <EditableItem textNode={data?.description} onSave={updateProfile}>
                  <FormItemNoMb name="description" initialValue={data?.description}>
                    <TextArea style={{ minWidth: '50vw' }} />
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
