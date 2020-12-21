import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { CommonChartComponentProps } from '../../lib/model/statistics';

export function LineChart({ data }: CommonChartComponentProps) {
  const [options, setOptions] = useState<any>({
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: 'New Students',
      },
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = new Array(12).fill(0).map((_, index) => {
      const month = index + 1;
      const name = month > 9 ? month + '' : '0' + month;
      const target = data.find((item) => item.name.split('-')[1] === name);

      return (target && target.amount) || 0;
    });

    setOptions({
      series: {
        name: 'Increment Amount',
        data: source,
      },
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
