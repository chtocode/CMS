import { Button } from 'antd';
import Modal, { ModalProps } from 'antd/lib/modal';
import React, { PropsWithChildren } from 'react';

export interface ModalFormProps extends ModalProps {
  cancel: () => void;
}

export default function ModalForm(props: PropsWithChildren<ModalFormProps>) {
  const { children, cancel, ...others } = props;

  return (
    <Modal
      {...others}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={cancel}
      footer={[
        <Button key="cancel" onClick={cancel}>
          Cancel
        </Button>,
      ]}
    >
      {props.children}
    </Modal>
  );
}
