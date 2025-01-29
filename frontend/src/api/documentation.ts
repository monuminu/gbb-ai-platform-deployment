import useSWR from 'swr';
import { useMemo } from 'react';

// project imports
import { fetcher, endpoints } from 'src/utils/axios';

import { IFaq } from 'src/types/faq';

// ----------------------------------------------------------------------

export function useFetchFaqList() {
  const URL = endpoints.documentation.faqs;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const faqList = useMemo(
    () => ({
      faqList: (data as IFaq[]) || [],
      isLoading,
      hasError: error,
      isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return faqList;
}

// ----------------------------------------------------------------------

export function useFetchContents(section: string) {
  const URL = section ? `${endpoints.documentation.contents}/${section}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const mockData: string = '';

  const contents = useMemo(
    () => ({
      webContent: data?.content || mockData,
      isLoadingWeb: isLoading,
      hasError: error,
      isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return contents;
}
