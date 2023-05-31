// tslint:disable:object-literal-shorthand
// tslint:disable:no-var-requires
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { zip } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { weekDays } from '../../lib/constant';
import { CommonChartComponentProps, CourseClassTimeStatistic } from '../../lib/model/statistics';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/heatmap')(Highcharts);
  require('highcharts/modules/exporting')(Highcharts);
}

function getPointCategoryName(point, dimension) {
  const series = point.series;
  const isY = dimension === 'y';
  const axis = series[isY ? 'yAxis' : 'xAxis'];

  return axis.categories[point[isY ? 'y' : 'x']];
}

export default function HeatChart({
  data,
  title,
}: CommonChartComponentProps<CourseClassTimeStatistic>) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'heatmap',
      plotBorderWidth: 1,
    },
    xAxis: {
      categories: weekDays.concat('<b>TOTAL</b>'),
    },
    accessibility: {
      point: {
        descriptionFormatter: (point) => {
          const ix = point.index + 1;
          const xName = getPointCategoryName(point, 'x');
          const yName = getPointCategoryName(point, 'y');
          const val = point.value;

          return ix + '. ' + xName + ' lessons ' + yName + ', ' + val + '.';
        },
      },
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#1890ff',
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280,
    },
    tooltip: {
      formatter: function () {
        return `<b> ${getPointCategoryName(this.point, 'y')}</b>
         <br/>
         <b>${this.point.value}</b> lessons on <b>${getPointCategoryName(this.point, 'x')}</b>`;
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                },
              },
            },
          },
        },
      ],
    },
    credits: {
      enabled: false,
    },
  });
  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;
    const timer = setTimeout(() => {
      chart.reflow();
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const yCategories = data.map((item) => item.name).concat('<b>TOTAL</b>');

    const rowData = data.map((item) => {
      const ary = new Array(7).fill(0);
      const courses = item.courses
        .map((course) => course.classTime)
        .flat()
        .map((item) => item?.split(' ')[0]);

      courses.forEach((weekday) => {
        const index = weekDays.findIndex((item) => item === weekday);

        ary[index] += 1;
      });

      return ary.concat(ary.reduce((acc, cur) => acc + cur));
    });

    const sourceData = zip(...rowData)
      .map((columnAry, index) => {
        const len = columnAry.length;
        const result = [];
        let i = 0;

        for (i = 0; i < len; i++) {
          result.push([index, i, columnAry[i]]);
        }

        result.push([index, i, result.reduce((acc, cur) => acc + cur[2], 0)]);

        return result;
      })
      .flat();


    setOptions({
      title: {
        text: `<span style="text-transform: capitalize">${title}</span>`,
      },
      yAxis: {
        categories: yCategories,
        title: null,
        reversed: true,
      },
      series: [
        {
          name: 'Lessons per weekday',
          borderWidth: 1,
          data: sourceData, // data format:  [column, row, amount] column, row 代表数据在表中的位置，amount：具体数据
          dataLabels: {
            enabled: true,
            color: '#000000',
          },
        },
      ],
    });
  }, [data]);

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={charRef}></HighchartsReact>
  );
}
