import { omitBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IResponse, ListResponse, Paginator, RequestOmitPaginator } from '../../lib/model';
import storage from '../../lib/services/storage';

export function useScrollLoad<P, T extends ListResponse, U = any>(
  apiFn: (req: P) => Promise<IResponse<ListResponse>>,
  sourceKey: keyof T,
  onlyFresh = true,
  params: Partial<RequestOmitPaginator<P>> = null
) {
  const [data, setData] = useState<U[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const request = useCallback(apiFn, []);
  const stringParams = JSON.stringify(params || {});

  useEffect(() => {
    const req = omitBy(
      { ...paginator, ...(params || {}), userId: storage.userId },
      (item: string | number | boolean | null) => item === '' || item === null
    ) as any;

    request(req).then((res) => {
      const { data: newData } = res;
      const fresh = (newData[sourceKey as string] as unknown) as U[];
      const source = onlyFresh ? fresh : [...data, ...fresh];

      setData(source);
      setTotal(newData.total);
      setHasMore(onlyFresh ? !!source.length && source.length < newData.total : newData.total > source.length);
    });
  }, [paginator, stringParams]);

  return {
    data,
    hasMore,
    paginator,
    total,
    setPaginator,
    setData: setData,
    setTotal,
  };
}
