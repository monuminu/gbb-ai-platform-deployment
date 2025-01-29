import useSWR, { mutate } from 'swr';
import { useMemo, useState, useCallback } from 'react';

// project imports
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { createQueryString } from 'src/utils/string-processor';

import { TOOL_API } from 'src/config-global';

import { ITool } from 'src/types/tool';

// ----------------------------------------------------------------------

export function useFetchTools() {
  const URL = endpoints.tool.list;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);
  const [isRefetching, setIsRefetching] = useState(false);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const toolsData = useMemo(
    () => ({
      tools: (data as ITool[]) || [],
      toolsLoading: isLoading,
      toolsError: error,
      toolsValidating: isValidating,
      toolsEmpty: !data || (!isLoading && !data.length),
      toolsRefetching: isRefetching,
      refetch,
    }),
    [data, error, refetch, isLoading, isRefetching, isValidating]
  );

  return toolsData;
}

// ----------------------------------------------------------------------

export function useFetchTool(id: string) {
  const URL = id ? `${endpoints.tool.list}/${id}` : '';

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);
  const [isRefetching, setIsRefetching] = useState(false);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const toolData = useMemo(
    () => ({
      tool: (data as ITool) || null,
      toolLoading: isLoading,
      toolError: error,
      toolValidating: isValidating,
      toolRefetching: isRefetching,
      refetch,
    }),
    [data, error, refetch, isLoading, isRefetching, isValidating]
  );

  return toolData;
}

// ----------------------------------------------------------------------

export async function uploadTool(toolData: FormData) {
  const URL = toolData ? endpoints.tool.create : '';

  try {
    const res = await axios.post(URL, toolData);
    if (res.status === 200) {
      const _toolData = res.data.item;
      await mutate(
        endpoints.tool.list,
        (currentData: any) => {
          const updatedData = currentData.map((item: any) =>
            item.id === _toolData.id ? _toolData : item
          );
          if (!currentData.some((item: any) => item.id === _toolData.id)) {
            updatedData.push(_toolData);
          }
          return updatedData;
        },
        false
      );
      return res.data;
    }
    return res;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function deployFunction(
  id: string,
  functionName: string,
  code: string,
  dependencies: string,
  envVars: object
) {
  const URL = code ? `${TOOL_API}register` : '';

  try {
    const res = await axios.post(URL, {
      functionName,
      functionScript: code,
      packages: dependencies,
      envVariables: envVars,
    });
    if (res.status === 200) {
      await mutate(
        endpoints.tool.list,
        (currentData: any) => {
          const updatedData = currentData.map((item: any) =>
            item.id === id ? { ...item, status: 'published' } : item
          );
          return updatedData;
        },
        false
      );
    }
    return res;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function testFunction(command: string) {
  const URL = command ? `${TOOL_API}execute` : '';

  try {
    const res = await axios.post(URL, {
      code: command,
    });
    return res;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function testApiCall(command: string) {
  const URL = command ? `${TOOL_API}execute` : '';

  try {
    const res = await axios.post(URL, {
      code: command,
    });
    return res;
  } catch (error) {
    return error;
  }
}

interface ApiCallParams {
  url: string;
  method: string;
  apiKey: string;
  apiParams?: Record<string, any>;
  // data?: Record<string, any>;
  data?: string;
}

export async function makeApiCall({
  url,
  method,
  apiKey,
  apiParams,
  data,
}: ApiCallParams): Promise<any> {
  try {
    // Step 1: Identify and replace placeholders in the URL
    let processedUrl = url;
    const placeholders = url.match(/\{[^}]+\}/g) || [];
    placeholders.forEach((placeholder) => {
      const key = placeholder.slice(1, -1); // Remove the enclosing {}
      if (apiParams && apiParams[key]) {
        processedUrl = processedUrl.replace(placeholder, encodeURIComponent(apiParams[key]));
        delete apiParams[key]; // Step 3: Remove used parameter
      }
    });

    // Construct the full URL with query parameters
    const fullUrl = `${processedUrl}${createQueryString(apiParams || {})}`;

    // Configure the request options
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `${apiKey}`,
        'Content-Type': 'application/json',
      },
      ...(method.toLowerCase() !== 'get' && { body: data }),
    };

    // Make the request
    const response = await fetch(fullUrl, options);

    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse and return the response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Handle and log any errors
    console.error('API call failed:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteTool(toolId: string) {
  const URL = toolId ? endpoints.tool.delete : '';

  try {
    const res = await axios.post(URL, { toolId });
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    return error;
  }
}
