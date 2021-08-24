import { omitBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IResponse, ListResponse, Paginator, RequestOmitPaginator } from '../../lib/model';

export function useListEffect<Req, Res extends ListResponse, Data = any>(
  apiFn: (req: Req) => Promise<IResponse<ListResponse>>,
  sourceKey: keyof Res,
  onlyFresh = true,
  params: Partial<RequestOmitPaginator<Req>> = null
) {
  const [data, setData] = useState<Data[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const request = useCallback(apiFn, []);
  const stringParams = JSON.stringify(params || {});

  useEffect(() => {
    const req = omitBy(
      { ...paginator, ...(params || {}) },
      (item: string | number | boolean | null) => item === '' || item === null
    ) as any;

    setLoading(true);

    request(req).then((res) => {
      const { data: newData } = res;
      const fresh = (newData[sourceKey as string] as unknown) as Data[];
      const source = onlyFresh ? fresh : [...data, ...fresh];

      setData(source);
      setTotal(newData.total);
      setHasMore(
        onlyFresh ? !!source.length && source.length < newData.total : newData.total > source.length
      );
      setLoading(false);
    });
  }, [paginator, stringParams]);

  return {
    data,
    hasMore,
    paginator,
    total,
    loading,
    setPaginator,
    setData,
    setTotal,
    setLoading,
  };
}
