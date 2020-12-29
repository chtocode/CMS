import { Col, Descriptions, Form } from 'antd';
import styled from 'styled-components';

export const OverviewIconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`;

export const OverviewCol = styled(Col)`
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`;

export const FormItemNoMb = styled(Form.Item)`
  margin-bottom: 0;
`;

export const DescriptionsVerticalMiddle = styled(Descriptions)`
  .ant-descriptions-item-label {
    align-items: center;
  }
`;
