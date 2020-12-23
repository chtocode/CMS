import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { SkillDes } from '../../lib/constant';
import { Statistic } from '../../lib/model/statistics';

export interface BarChartProps {
  data: {
    interest: Statistic[];
    teacher: Statistic[];
  };
}

type ISeriesItem = {
  name: string;
  stack: string;
  data: number[];
};

export default function BarChart({ data }: BarChartProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: 'Comparing what students are interested in and teachers’ skills',
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Interested VS Skills',
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === 'Interest'
          ? `${this.series.name}: ${this.y}`
          : `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>total: ${this.point.stackTotal}`;
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    }
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => !item)) {
      return;
    }

    const { interest, teacher } = data;
    const xCategories: string[] = uniq([
      ...interest.map(({ name }) => name),
      ...Object.keys(teacher),
    ]);
    const interestItem: ISeriesItem = xCategories.reduce(
      (acc, language) => {
        const target = interest.find((item) => item.name === language);

        acc.data.push(target ? target.amount : 0);
        return acc;
      },
      { name: 'Interest', stack: 'interest', data: [] }
    );
    const levels = uniq(
      Object.values(teacher)
        .flat()
        .map((item) => item.level)
    ).sort();
    const teacherBar: ISeriesItem[] = levels.map((level) => ({
      name: SkillDes[level],
      data: xCategories.map(
        (lan) => teacher[lan]?.find((item: Statistic) => item.level === level)?.amount || 0
      ),
      stack: 'teacher',
    }));

    setOptions({
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        categories: xCategories,
      },
      series: [...teacherBar, interestItem],
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
