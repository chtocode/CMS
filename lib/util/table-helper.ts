import { TableProps } from 'antd/lib/table';
import { Paginator } from '../model/api';

export const genCommonTableProps: (
  props: TableProps<any> & {
    total: number;
    paginator: Paginator;
    setPaginator: (paginator: Paginator) => void;
    data: any[];
  }
) => TableProps<any> = ({
  columns,
  data,
  paginator,
  total,
  loading,
  setPaginator,
  rowKey = 'id',
}) => {
  const props: TableProps<any> = {
    dataSource: data,
    columns,
    onChange: ({ current, pageSize }) => {
      setPaginator({ ...paginator, page: current, limit: pageSize });
    },
    pagination: {
      current: paginator.page,
      pageSize: paginator.limit,
      total,
      showSizeChanger: true,
    },
    loading,
    rowKey,
  };

  return props;
};
