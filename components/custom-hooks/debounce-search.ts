import { debounce } from 'lodash';
import { ChangeEvent, useCallback } from 'react';

export function useDebounceSearch(cb: (value: string) => void) {
  const debouncedQuery = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => cb(event.target.value), 1000),
    []
  );

  return debouncedQuery;
}
