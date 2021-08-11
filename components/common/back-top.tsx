import { VerticalAlignTopOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToTop = styled(VerticalAlignTopOutlined)`
  position: fixed;
  bottom: 50px;
  right: 15px;
  z-index: 999;
  font-size: 40px;
  color: #fff;
  padding: 5px;
  background: rgba(0, 0, 0, .3);
  opacity: 0.5;
  transition: all 0.5s;
  :hover {
    opacity: 0.8;
  }
`;

export default function BackTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById('contentLayout'); // issue -> 服务端渲染
    const listener = (event) => {
      const visible = event.target.scrollTop > 600;

      setVisible(visible);
    };
    element.addEventListener('scroll', listener);

    return () => {
      element.removeEventListener('scroll', listener);
    };
  }, [visible]);

  return visible ? (
    <ToTop
      onClick={() => {
        const element = document.getElementById('contentLayout');
        
        element.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  ) : null;
}
