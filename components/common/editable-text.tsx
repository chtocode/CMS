import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import styled, { CSSProperties } from 'styled-components';

export interface EditableItemProps {
  textNode: any;
  onSave: (value: object) => void;
  allowEnterToSave?: boolean;
  hideControlBtn?: boolean;
  textContainerStyles?: CSSProperties;
  initialValues?: { [key: string]: any };
  layout?: 'column' | 'row';
}

const Control = styled.div`
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
  const isColumn = props.layout === 'column';

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
          initialValues={props?.initialValues}
          style={{ width: '100%' }}
        >
          <Control
            style={{
              display: isColumn ? 'block' : 'flex',
            }}
          >
            {props.children}
            {!props.hideControlBtn && (
              <div style={isColumn ? { display: 'flex', gap: 10, marginTop: 10 } : {}}>
                <Button
                  type={isColumn ? 'default' : 'link'}
                  danger={isColumn}
                  onClick={() => setIsEditing(false)}
                >
                  {isColumn ? 'Cancel' : <CloseOutlined />}
                </Button>
                <Button htmlType="submit" type={isColumn ? 'default' : 'link'}>
                  {isColumn ? 'Save' : <CheckOutlined />}
                </Button>
              </div>
            )}
          </Control>
        </Form>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)} style={props?.textContainerStyles}>
          {props.textNode}
        </div>
      )}
    </>
  );
}
