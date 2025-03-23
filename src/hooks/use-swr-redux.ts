import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppDispatch } from '@/store/hooks';

type FetcherFn<T> = (url: string) => Promise<T>;
type ActionCreatorFn<T> = (data: T) => any;

// Default fetcher function
const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Custom hook that combines SWR with Redux
 * @param url The URL to fetch data from
 * @param actionCreator The Redux action creator to dispatch with the fetched data
 * @param fetcher Optional custom fetcher function
 * @returns The SWR response object
 */
export function useSWRRedux<T>(
  url: string | null, 
  actionCreator: ActionCreatorFn<T>,
  fetcher: FetcherFn<T> = defaultFetcher
) {
  const dispatch = useAppDispatch();
  const swr = useSWR<T>(url, fetcher);
  
  useEffect(() => {
    if (swr.data) {
      dispatch(actionCreator(swr.data));
    }
  }, [swr.data, dispatch, actionCreator]);
  
  return swr;
}