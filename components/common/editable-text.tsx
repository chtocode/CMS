import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface EditableItemProps {
  textNode: any;
  onSave: (value: object) => void;
  allowEnterToSave?: boolean;
  hideControlBtn?: boolean;
}

const Control = styled.div`
  display: flex;
  align-items: center;
  .anticon {
    cursor: pointer;
  }
  .anticon-close {
    color: red;
  }
  .anticon-check {
    color: #1890ff;
  }
  .ant-btn {
    padding: 4px;
  }
`;

export default function EditableItem(props: React.PropsWithChildren<EditableItemProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = useForm();

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          onFinish={(value) => {
            props.onSave(value);
            setIsEditing(false);
          }}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (props.allowEnterToSave && event.key === 'Enter') {
              form.submit();
            }
          }}
        >
          <Control>
            {props.children}
            {!props.hideControlBtn && (
              <>
                <Button type="link" onClick={() => setIsEditing(false)}>
                  <CloseOutlined />
                </Button>
                <Button htmlType="submit" type="link">
                  <CheckOutlined />
                </Button>
              </>
            )}
          </Control>
        </Form>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)}>{props.textNode}</div>
      )}
    </>
  );
}
