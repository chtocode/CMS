import { omitBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IResponse, ListResponse, Paginator, RequestOmitPaginator } from '../../lib/model';

export function useListEffect<P, T extends ListResponse, U = any>(
  apiFn: (req: P) => Promise<IResponse<ListResponse>>,
  sourceKey: keyof T,
  onlyFresh = true,
  params: Partial<RequestOmitPaginator<P>> = null
) {
  const [data, setData] = useState<U[]>([]);
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
      const fresh = (newData[sourceKey as string] as unknown) as U[];
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
