/* eslint-disable */
import useSWR, { mutate } from 'swr';
import readNDJSONStream from 'ndjson-readablestream';
import { useMemo, useState, useCallback } from 'react';

import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import uuidv4 from 'src/utils/uuidv4';
import axios, { fetcher, endpoints } from 'src/utils/axios';

import { BACKEND_API } from 'src/config-global';

import { MlAppStruct } from 'src/types/app';
import { ChatAppRequest, ChatAppResponseOrError } from 'src/types/chat';

import {
  chatApi,
  getHeaders,
  convertBase64,
  handleAsyncRequest,
  parseFunctionResponse,
} from './gpt';

// ----------------------------------------------------------------------

export function useFetchApps() {
  const URL = endpoints.app.list;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);
  const [isRefetching, setIsRefetching] = useState(false);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const appData = useMemo(
    () => ({
      apps: (data as MlAppStruct[]) || [],
      appsLoading: isLoading,
      appsError: error,
      appsValidating: isValidating,
      appsEmpty: !data || (!isLoading && !data.length),
      appsRefetching: isRefetching,
      refetch,
    }),
    [data, error, refetch, isLoading, isRefetching, isValidating]
  );

  return appData;
}

// ----------------------------------------------------------------------

export async function deleteCustomGpt(gptId: string) {
  const URL = gptId ? endpoints.app.customGpt.delete : '';

  try {
    const res = await axios.post(URL, { gptId });
    if (res.status === 200) {
      await mutate(
        endpoints.app.list,
        (currentData: any) => {
          const updatedData = currentData.filter((item: any) => item.id !== gptId);
          return updatedData;
        },
        false
      );
      return res.data;
    }
    return null;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function uploadCustomGpt(customGptData: FormData) {
  const URL = customGptData ? endpoints.app.customGpt.create : '';

  try {
    const res = await axios.post(URL, customGptData);
    if (res.status === 200) {
      const appData = res.data.item;
      await mutate(
        endpoints.app.list,
        (currentData: any) => {
          const updatedData = currentData.map((item: any) =>
            item.id === appData.id ? appData : item
          );
          if (!currentData.some((item: any) => item.id === appData.id)) {
            updatedData.push(appData);
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

export async function getFileSas(fileName: string) {
  const URL = `${endpoints.app.customGpt.sas}/${fileName}`;

  try {
    const res = await axios.get(URL);
    if (res.status === 200) {
      return res.data.sas;
    }
    return res;
  } catch (error) {
    return error;
  }
}

export async function handleDaCall(
  apiUrl: string,
  msgId: string,
  query: string,
  files: File[],
  onUpdateContent: (messageId: string, content: string, status: string) => void,
  aoaiResourceName: string
) {
  // console.log(msgId);
  if (apiUrl === '') {
    onUpdateContent(msgId, 'No API was condigured.', 'completed');
    return;
  }

  const aoai_credentials = getStorage(AOAI_CREDENTIAL_KEY);
  const aoaiConfig =
    aoai_credentials &&
    aoai_credentials.find((item: any) => item.resourceName === aoaiResourceName);

  if (files.length === 0) {
    onUpdateContent(msgId, 'No file was selected. Please select a file first.', 'completed');
    return;
  }

  if (!aoaiConfig) {
    onUpdateContent(
      msgId,
      'No AOAI resource was located. Please add an AOAI resource on the User/Account page first.',
      'completed'
    );
    return;
  }

  const aoai = {
    api_version: aoaiConfig.apiVersion,
    azure_endpoint: aoaiConfig.endpoint,
    api_key: aoaiConfig.key,
    model: aoaiConfig.model,
    deployment: aoaiConfig.deployment,
  };

  const formData = new FormData();
  // formData.append('file', files[0]);
  files.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });
  formData.append('query', query);
  formData.append('aoai', JSON.stringify(aoai));

  try {
    const res = await axios.post(apiUrl, formData);
    if (res.status === 200) {
      onUpdateContent(msgId, JSON.stringify(res.data), 'completed');
    }
    // return res;
  } catch (error) {
    onUpdateContent(msgId, JSON.stringify(error), 'failed');
  }
}

// ----------------------------------------------------------------------

export function useFetchRecommendations(endpoint: string, key: string) {
  const URL = `${BACKEND_API}/perplexity/start`;

  const _fetcher = async () =>
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, key }),
    }).then((response) => response.json());

  const { data, error, isLoading, isValidating } = useSWR(URL, _fetcher);

  const appData = useMemo(
    () => ({
      recommendation: data,
      isLoading,
      error,
      validating: isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return appData;
}

// ----------------------------------------------------------------------

export async function getTranslationText(
  endpoint: string,
  key: string,
  sourceLang: string,
  targetLang: string,
  sourceText: string
) {
  const URL = `${BACKEND_API}/translate/text`;

  try {
    const res = await axios.post(URL, { endpoint, key, sourceLang, targetLang, sourceText });
    if (res.status === 200) {
      return res.data;
    }
    return res;
  } catch (error) {
    return error;
  }
}

export async function getTranslationDocument(
  file: File,
  endpoint: string,
  key: string,
  targetLang: string,
  targetFileName: string
) {
  const formData = new FormData();
  // formData.append('file', files[0]);
  formData.append(`file`, file);
  formData.append('key', key);
  formData.append('endpoint', endpoint);
  formData.append('targetLang', targetLang);
  formData.append('targetFileName', targetFileName);

  const URL = `${BACKEND_API}/translate/document`;
  try {
    const res = await axios.post(URL, formData);
    if (res.status === 200) {
      return res.data;
    }
    return res;
  } catch (error) {
    return error;
  }
}

export async function getTranslationStatus(fileName: string) {
  const URL = `${BACKEND_API}/translate/status`;

  try {
    const res = await axios.post(URL, { fileName });
    if (res.status === 200) {
      return res.data;
    }
    return res;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

const handleAsyncChunk = async (
  msgId: string,
  setAnswer: Function,
  setAgents: Function,
  setAgentMessages: Function,
  setCost: Function,
  responseBody: ReadableStream<any>
) => {
  let _content: string = '';

  const updateState = (newContent: string) =>
    new Promise((resolve) => {
      _content += newContent;
      setAnswer(msgId, _content, 'completed');
      resolve(null);
    });
  // new Promise((resolve) => {
  //   setTimeout(() => {
  //     _content += newContent;
  //     setAnswer(msgId, _content, 'completed');
  //     resolve(null);
  //   }, 33);
  // });

  try {
    /* eslint-disable no-restricted-syntax */
    for await (const event of readNDJSONStream(responseBody)) {
      // console.log('event');
      // console.log(typeof event);
      // console.log(event);

      const lines = event.split('\n');
      /* eslint-disable no-restricted-syntax */
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          // console.log(jsonStr);
          try {
            const data = JSON.parse(jsonStr);
            // console.log('data: ', data);
            if (Object.prototype.hasOwnProperty.call(data, 'answer')) {
              const { answer } = data;
              if (answer) {
                // const answerData = JSON.parse(answer);
                const answerData = answer;
                // console.log('answerData: ', answerData);
                let _receiver;

                if (Object.prototype.hasOwnProperty.call(answerData, 'receiver')) {
                  const { receiver } = answerData;
                  _receiver = receiver;
                }

                if (Object.prototype.hasOwnProperty.call(answerData, 'messages')) {
                  const { cost, messages } = answerData;
                  if (messages) {
                    const isArrayofStrings =
                      Array.isArray(messages) &&
                      messages.every((message) => typeof message === 'string');

                    if (_receiver === 'EndUser' && isArrayofStrings) {
                      const _agents = messages.map((_agentName, index) => ({
                        name: _agentName,
                        description: '',
                        avatar: `/static/mock-images/chatbots/chatbot-${index + 1}.jpg`,
                      }));
                      setAgents(msgId, _agents);
                    } else if (_receiver === 'EndUser' && !isArrayofStrings) {
                      if (
                        cost &&
                        Object.prototype.hasOwnProperty.call(
                          cost,
                          'usage_including_cached_inference'
                        )
                      ) {
                        setCost(msgId, [
                          {
                            name: 'usage_including_cached_inference',
                            items: cost.usage_including_cached_inference['gpt-4o-2024-05-13'],
                          },
                        ]);
                      }
                      await updateState(messages);
                    } else {
                      // console.log('messages');
                      // console.log(messages);
                      // if (messages.length > 0) {
                      //   setAgents(msgId, [
                      //     {
                      //       name: 'UserProxy',
                      //       description:
                      //         'A computer terminal that performs no other action than running Python scripts (provided to it quoted in ```python code blocks), or sh shell scripts (provided to it quoted in ```sh code blocks).',
                      //       avatar: '/static/mock-images/chatbots/chatbot-2.jpg',
                      //     },
                      //     {
                      //       name: 'CustomerProfileQnAAssistant',
                      //       description:
                      //         "You are a files search assistant tool. You can answer questions about the customer profile including the customer's financial and medical history. Use the configured vector store to search for info.",
                      //       avatar: '/static/mock-images/chatbots/chatbot-3.jpg',
                      //     },
                      //     {
                      //       name: 'DocumentProcessingAssistant',
                      //       description: 'You are a document processing assistant.',
                      //       avatar: '/static/mock-images/chatbots/chatbot-4.jpg',
                      //     },
                      //   ]);
                      // }
                      const [, ...restMessages] = messages;
                      const _agentMessages = restMessages.map((msg: any) => {
                        const { name, content, role } = msg;
                        return {
                          name,
                          role,
                          content,
                          createdAt: new Date(),
                        };
                      });
                      setAgentMessages(msgId, _agentMessages);
                    }
                  }
                }
              }
            }
          } catch (error) {
            // console.error('Invalid JSON:', jsonStr);
            console.error(error);
          }
        }
      }
      /* eslint-disable no-restricted-syntax */
    }
  } catch (error) {
    setAnswer(error.message);
  }
};

export async function handleMultiAgentCall(
  endpoint: string,
  key: string,
  msgId: string,
  userId: string,
  query: string,
  onUpdateContent: (messageId: string, content: string, status: string) => void,
  setAgents: Function,
  setAgentMessages: Function,
  setCost: Function
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

  try {
    const response = await fetch(`${BACKEND_API}/perplexity`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ endpoint, key, query, customer_id: userId }),
    });
    if (response && response.body)
      await handleAsyncChunk(
        msgId,
        onUpdateContent,
        setAgents,
        setAgentMessages,
        setCost,
        response.body
      );
  } catch (error) {
    onUpdateContent(msgId, JSON.stringify(error), 'failed');
  }
}

// ----------------------------------------------------------------------

const askApi = async (
  request: ChatAppRequest,
  idToken: string | undefined,
  indexName: string | undefined,
  embeddingConfig: Record<string, string>,
  aoaiConfig: Record<string, string>
): Promise<Response> => {
  if (!indexName) return null as any;
  return fetch(`${BACKEND_API}/manufacturing_copilot`, {
    method: 'POST',
    headers: getHeaders(idToken),
    body: JSON.stringify({
      ...request,
      aoai_config: aoaiConfig,
      embedding_config: embeddingConfig,
      ai_search_config: { index_name: indexName },
    }),
  });
};

type Props = {
  mode: string;
  onSend: Function;
  request: ChatAppRequest;
  shouldStream: boolean;
  aoaiResourceName: string;
  indexName?: string;
  buttonContent?: string;
  systemPrompt?: string;
  messageId?: string;
};

export const callManufacturingCopilot = async ({
  mode,
  onSend,
  request,
  shouldStream,
  aoaiResourceName,
  indexName = undefined,
  buttonContent = undefined,
  systemPrompt = undefined,
  messageId = undefined,
}: Props) => {
  try {
    console.log(indexName);
    const setResponse = (response: any, thoughts?: any[]) => {
      if (!messageId) {
        onSend({
          content: response,
          senderId: 'assistant',
          mode: 'attach',
          msgId: uuidv4(),
          ...(thoughts && thoughts.length > 0 && { thoughts }),
        });
      } else {
        // For ChatDA
        onSend(messageId, response, 'completed');
      }
    };

    // let hasFiles = false;
    const reformedMessages = request.messages.map(async (message) => {
      const { role, content, attachments, name, function_call } = message;

      if (mode !== 'function-calling' && attachments && attachments.length > 0) {
        // hasFiles = true;
        const imgContents = await Promise.all(
          attachments!.map(async (attachment) => ({
            type: 'image_url',
            image_url: {
              url: attachment.preview.startsWith('data:')
                ? attachment.preview
                : await convertBase64(attachment),
            },
          }))
        );
        return { role, content: [...imgContents, { type: 'text', text: content }] };
      }
      return {
        role,
        content,
        ...(name && { name }),
        ...(function_call && { function_call }),
      };
    });

    const reformedRequest = {
      ...request,
      messages: [
        ...(await Promise.all(reformedMessages)),
        ...(buttonContent ? [{ content: buttonContent, role: 'user' }] : []),
      ],
    };

    const aoai_credentials = getStorage(AOAI_CREDENTIAL_KEY);
    const aoaiConfig =
      aoai_credentials &&
      aoai_credentials.find((item: any) => item.resourceName === aoaiResourceName);

    if (!aoaiConfig) {
      if (!messageId) {
        onSend({
          content:
            'No AOAI resource was located. Please add an AOAI resource on the User/Account page first.',
          senderId: 'assistant',
          mode: 'new',
        });
      } else {
        onSend(
          messageId,
          'No AOAI resource was located. Please add an AOAI resource on the User/Account page first.',
          'completed'
        );
      }

      return;
    }

    const aoai = {
      api_version: aoaiConfig.apiVersion,
      azure_endpoint: aoaiConfig.endpoint,
      api_key: aoaiConfig.key,
      model: aoaiConfig.model,
      deployment: aoaiConfig.deployment,
    };

    // if (hasFiles) {
    //   await aoaiVisionApi(reformedRequest.messages, undefined, setResponse, aoai, systemPrompt);
    //   return;
    // }

    let response;
    if (mode === 'rag') {
      const embeddingConfig =
        aoai_credentials && aoai_credentials.find((item: any) => item.model.includes('embedding'));

      if (!embeddingConfig) {
        onSend({
          content:
            'No text embedding model was found. Please add an Embedding resource on the User/Account page first.',
          senderId: 'assistant',
          mode: 'new',
        });
        return;
      }

      const aoaiEmbedding = {
        api_version: embeddingConfig.apiVersion,
        azure_endpoint: embeddingConfig.endpoint,
        api_key: embeddingConfig.key,
        model: embeddingConfig.model,
        deployment: embeddingConfig.deployment,
      };

      if (indexName !== '')
        response = await askApi(reformedRequest, undefined, indexName, aoaiEmbedding, aoai);
      else {
        onSend({
          content: 'No custom knowledge was selected. The answer is based on LLM knowledge.',
          senderId: 'assistant',
          mode: 'new',
        });
        response = await chatApi(reformedRequest, undefined, aoai);
      }
    } else {
      response = await chatApi(reformedRequest, undefined, aoai, false);
    }

    if (response === null) {
      onSend({
        content: 'No response from server. Please check your configuration.',
        senderId: 'assistant',
        mode: 'new',
      });
      return;
    }

    if (!response.body) {
      throw Error('No response body');
    }
    if (shouldStream && mode !== 'function-calling') {
      await handleAsyncRequest(setResponse, response.body);
    } else {
      const parsedResponse: ChatAppResponseOrError = await response.json();
      if (response.status > 299 || !response.ok) {
        onSend({
          content: parsedResponse.error,
          senderId: 'assistant',
          mode: 'new',
        });
        throw Error(parsedResponse.error || 'Unknown error');
      }
      if (parsedResponse && parsedResponse.choices) {
        if (parsedResponse.choices[0].finish_reason === 'function_call') {
          parseFunctionResponse(parsedResponse, onSend);
        } else {
          onSend({
            content: parsedResponse.choices[0].message.content,
            senderId: 'assistant',
            mode: 'attach',
          });
        }
      }
    }
  } catch (e) {
    onSend({
      content: e.message,
      senderId: 'assistant',
      mode: 'new',
    });
  }
};
