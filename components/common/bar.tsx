import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { CommonChartComponentProps } from '../../lib/model/statistics';

export function Bar({ data }: CommonChartComponentProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Courses students interested in',
      },
    },
    legend: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = data.map(({ name, amount }) => [name, amount]);

    setOptions({
      series: [
        {
          name: 'Interested in',
          data: source,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
      ],
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
