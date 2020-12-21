import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { CommonChartComponentProps } from '../../lib/model/statistics';

export function Pie({ data }: CommonChartComponentProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: '',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = data.map((item) => ({ name: item.name, y: item.amount }));
    setOptions({
      series: [
        {
          name: 'percentage',
          colorByPoint: true,
          data: source,
        },
      ],
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
