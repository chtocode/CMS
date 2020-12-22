import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { CommonChartComponentProps } from '../../lib/model/statistics';

export function PieChart({ data, title }: CommonChartComponentProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
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
    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = data.map((item) => ({ name: item.name, y: item.amount }));

    setOptions({
      title: {
        text: `<span style="text-transform: capitalize">${title
          .split(/(?=[A-Z])/)
          .join(' ')}</span>`,
      },
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
