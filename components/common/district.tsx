import Link from 'antd/lib/typography/Link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommonChartComponentProps } from '../../lib/model/statistics';

declare var AMap: any;

export const Legend = styled.ul`
  position: absolute;
  left: 0;
  bottom: 10px;
  list-style: none;
  overflow: hidden;
  margin: 0;
  padding: 10px;
  background: #e7e1e191;
  z-index: 99;
  li {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .legend {
    display: inline-block;
  }
  span {
    width: 14px;
    height: 14px;
    line-height: 1;
  }
  a {
    color: #555;
    font-size: 14px;
    text-decoration: none;
    height: 30px;
    line-height: 30px;
  }
`;

/**
 * @deprecated This is a amap implementation
 */
export default function District({ data = [] }: CommonChartComponentProps) {
  const counts = [300, 100, 50, 10, 5, 1];
  const colors = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'].reverse();
  const nationStroke = 'rgba(20, 20, 120, 0.6)';
  const [disWorld, setDisWorld] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const disWorld = new AMap.DistrictLayer.World({
      // 绘制世界地图国家轮廓
      zIndex: 10,
      styles: {
        'nation-stroke': nationStroke,
      },
    });
    const map = new AMap.Map('user-amap-container', {
      zooms: [3, 18],
      center: [110, 30],
      showIndoorMap: false,
      zoom: 0,
      isHotspot: false,
      defaultCursor: 'pointer',
      touchZoomCenter: 1,
      pitch: 0,
      layers: [disWorld],
      viewMode: '3D',
      resizeEnable: true,
    });

    AMap.plugin(['AMap.ToolBar'], () => {
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(
        new AMap.ToolBar({
          liteStyle: true, // 简易缩放模式，默认为 false
        })
      );
    });

    setDisWorld(disWorld);
    setMap(map);
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    let infoWindow = null;
    const listener = (event) => {
      const px = event.pixel;
      const district = disWorld.getDistrictByContainerPos(px); // 拾取所在位置的行政区

      if (district && district.SOC) {
        const name: string = district.NAME_ENG;
        const target = data.find((item) => item.name.toLowerCase() === name.toLowerCase());
        const content = `${district.NAME_ENG}: ${target?.amount || 0}`;

        infoWindow = new AMap.InfoWindow({ content });
        infoWindow.open(map, event.lnglat);
      } else {
        if (!!infoWindow) {
          infoWindow.close();
        }
      }
    };

    map.on('mousemove', listener);

    return () => {
      map.off('mousemove', listener);
    };
  });

  useEffect(() => {
    if (disWorld && data.length) {
      disWorld.setStyles({
        'nation-stroke': nationStroke,
        fill: (district) => {
          const target = data.find(
            (item) => item.name.toLowerCase() === district.NAME_ENG.toLowerCase()
          );

          if (!target) {
            return 'white';
          }

          const amount = target.amount;
          if (amount > counts[0]) {
            return colors[0];
          } else if (amount > counts[1]) {
            return colors[1];
          } else if (amount > counts[2]) {
            return colors[2];
          } else if (amount > counts[3]) {
            return colors[3];
          } else if (amount > counts[4]) {
            return colors[4];
          } else {
            return colors[5];
          }
        },
      });
    }
  });

  return (
    <div id="user-amap-container" style={{ width: '100%', height: 500, position: 'relative' }}>
      <Legend>
        {colors.map((color, index) => (
          <li key={index} style={{ height: 30 }}>
            <span style={{ backgroundColor: color }} className="legend"></span>
            <span> &gt; </span>
            <Link>{counts[index]}</Link>
          </li>
        ))}
      </Legend>
    </div>
  );
}
