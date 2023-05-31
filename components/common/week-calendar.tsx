import Table, { ColumnType } from 'antd/lib/table';
import React from 'react';
import { weekDays } from '../../lib/constant';

interface WeekCalendarProps {
  data: string[];
}

export default function WeekCalendar({ data }: WeekCalendarProps) {
  if (!data) {
    return <></>;
  }

  const headers = [...weekDays];
  
  const columns: ColumnType<{ title: string; time: string }>[] = headers.map((title, index) => {
    const target =
      data.find((item) => item.toLocaleLowerCase().includes(title.toLocaleLowerCase())) || '';
    const time = target.split(' ')[1];

    return { title, key: index, align: 'center', render: () => time };
  });

  const dataSource = new Array(1).fill({ id: 0 });

  return (
    <Table
      rowKey="id"
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      onRow={() => ({
        onMouseEnter: (event) => {
          const parent = (event.target as any).parentNode;

          Array.prototype.forEach.call(parent.childNodes, (item) => {
            item.style.background = 'transparent';
          });
          parent.style.background = 'transparent';
        },
      })}
    ></Table>
  );
}
