/* eslint-disable */
import readNDJSONStream from 'ndjson-readablestream';

import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import uuidv4 from 'src/utils/uuidv4';

import { testFunction } from 'src/api/tool';

import { createQueryString, escapeSpecialCharacters } from 'src/utils/string-processor';

import { BACKEND_API } from 'src/config-global';

import {
  ChatAppRequest,
  ChatAppResponse,
  ResponseMessage,
  ChatAppResponseOrError,
} from 'src/types/chat';
import { ITool } from 'src/types/tool';

// ----------------------------------------------------------------------

export const getHeaders = (idToken: string | undefined): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

  return headers;
};

export const convertBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
      console.error(error);
    };
  });

export const convertWebToMD = async (url: string) => {
  const webContent = await fetch(`https://r.jina.ai/${url}`);
  const data = await webContent.text();
  // console.log(data);
  return data;
};

// const getCitationFilePath = (citation: string): string => {
//   return `${BACKEND_API}/content/${citation}`;
// };

export const parseFunctionResponse = async (parsedResponse: any, onSend: Function) => {
  const funcArgStr = parsedResponse.choices[0].message.function_call.arguments;
  const funcName = parsedResponse.choices[0].message.function_call
    ? parsedResponse.choices[0].message.function_call.name
    : '';
  const funcArgs = funcArgStr ? JSON.parse(funcArgStr) : {};
  onSend({
    content: `(SYS)function calling: ${funcName}`,
    senderId: 'assistant',
    mode: 'attach',
    function_calls: [{ funcName, funcArgs: funcArgStr, results: '' }],
  });

  // const response = await pluginApi(funcArgs, funcName);
  // console.log(funcName);
  // console.log(funcArgs);

  // {query: 'What is new with GPT-4o?'}

  try {
    const argsString = Object.entries(funcArgs)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}='${escapeSpecialCharacters(value as any)}'`)
      .join(', ');

    const command = `${funcName}(${argsString})`;
    // console.log(command);

    const response = await testFunction(command);

    // const response = await axios.post(FUNCTION_API, {
    //   action: funcName,
    //   params: funcArgs,
    // });
    if (response && response.status === 200) {
      // Assuming response.data is a stringified JSON object
      let finalResults;
      if (typeof response.data === 'string') {
        try {
          const responseData = JSON.parse(response.data);
          finalResults = responseData.hasOwnProperty('result') ? responseData.result : responseData;
        } catch (error) {
          finalResults = response.data;
        }
      } else {
        finalResults = response.data.hasOwnProperty('result')
          ? response.data.result
          : response.data;
      }

      // console.log(finalResults);
      // console.log([{ funcName, funcArgs: funcArgStr, results: finalResults }]);
      onSend({
        content: `(SYS)function executed: ${funcName}`,
        senderId: 'assistant',
        mode: 'attach',
        function_calls: [{ funcName, funcArgs: funcArgStr, results: finalResults }],
      });
    } else if (response && response.status > 299) {
      const content = `Error: ${response.status}  ${response.statusText}`;
      onSend({
        content,
        senderId: 'assistant',
        mode: 'new',
      });
    }
  } catch (error) {
    onSend({
      content: error,
      senderId: 'assistant',
      mode: 'new',
    });
  }
};

export const executeFunction = async (
  funcName: string,
  funcArgStr: string,
  selectedTool: ITool,
  onSend: Function
) => {
  if (!selectedTool) {
    onSend({
      content: 'Tool execution failed. Please select a tool first.',
      senderId: 'assistant',
      mode: 'new',
    });
    return;
  }

  const funcArgs = funcArgStr ? JSON.parse(funcArgStr) : {};
  onSend({
    content: `(SYS)function calling: ${funcName}`,
    senderId: 'assistant',
    mode: 'attach',
    function_calls: [{ funcName, funcArgs: funcArgStr, results: '' }],
  });

  // console.log(selectedTool);
  // console.log(funcName);
  // console.log(funcArgs);

  try {
    const { type, params, apiAuth } = selectedTool;
    if (type.toLowerCase() === 'openapi') {
      const url = params.find((param) => param.name === 'url')?.value || '';
      const method = params.find((param) => param.name === 'method')?.value || '';
      const requestBody = funcArgStr || '';
      const filteredParams = params.filter(
        (param) => !['url', 'method', 'path', 'requestBody'].includes(param.name)
      );

      const apiKey = apiAuth?.apiKey || '';
      const apiParams =
        method.toLowerCase() === 'get'
          ? funcArgs
          : filteredParams.reduce<Record<string, string>>((acc, param) => {
              acc[param.name] = param.value;
              return acc;
            }, {});

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

      if (!fullUrl || !method) {
        const content = `Error: API URL not found`;
        onSend({
          content,
          senderId: 'assistant',
          mode: 'new',
        });
      }

      // Configure the request options
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `${apiKey}`,
          'Content-Type': 'application/json',
        },
        ...(method.toLowerCase() !== 'get' && { body: requestBody }),
      };

      // console.log(apiParams);
      // console.log(fullUrl);
      // console.log(options);

      // Make the request
      const response = await fetch(fullUrl, options);

      if (!response.ok) {
        const content = `HTTP error! status: ${response.status}`;
        onSend({
          content,
          senderId: 'assistant',
          mode: 'new',
        });
      }

      // Parse and return the response data
      const responseData = await response.json();

      if (responseData) {
        let finalResults;
        if (typeof responseData === 'object') {
          finalResults = JSON.stringify(responseData);
        } else {
          finalResults = responseData;
        }

        // console.log([{ funcName, funcArgs: funcArgStr, results: JSON.stringify(responseData) }]);
        onSend({
          content: `(SYS)function executed: ${funcName}`,
          senderId: 'assistant',
          mode: 'attach',
          function_calls: [{ funcName, funcArgs: funcArgStr, results: finalResults }],
        });
      } else {
        const content = `Error: ${response.status}  ${response.statusText}`;
        onSend({
          content,
          senderId: 'assistant',
          mode: 'new',
        });
      }
    } else if (type.toLowerCase() === 'python') {
      const argsString = Object.entries(funcArgs)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}='${escapeSpecialCharacters(value as any)}'`)
        .join(', ');
      const command = `${funcName}(${argsString})`;

      // console.log(command);
      const response = await testFunction(command);
      // const response = await axios.post(FUNCTION_API, {
      //   action: funcName,
      //   params: funcArgs,
      // });
      if (response && response.status === 200) {
        // Assuming response.data is a stringified JSON object
        let finalResults;
        if (typeof response.data === 'string') {
          try {
            const responseData = JSON.parse(response.data);
            finalResults = responseData.hasOwnProperty('result')
              ? responseData.result
              : responseData;
          } catch (error) {
            finalResults = response.data;
          }
        } else {
          finalResults = response.data.hasOwnProperty('result')
            ? response.data.result
            : response.data;

          // If the function is not registered
          if (finalResults.includes('Error') && finalResults.includes('Traceback')) {
            finalResults = 'The function is not available for now.';
          }
        }
        onSend({
          content: `(SYS)function executed: ${funcName}`,
          senderId: 'assistant',
          mode: 'attach',
          function_calls: [{ funcName, funcArgs: funcArgStr, results: finalResults }],
        });
      } else if (response && response.status > 299) {
        const content = `Error: ${response.status}  ${response.statusText}`;
        onSend({
          content,
          senderId: 'assistant',
          mode: 'new',
        });
      }
    }
  } catch (error) {
    onSend({
      content: error,
      senderId: 'assistant',
      mode: 'new',
    });
  }
};

interface Event {
  choices: Choice[];
}

interface Choice {
  delta: Delta;
}

interface Delta {
  content?: string;
  function_call?: FunctionCall;
}

interface FunctionCall {
  name?: string;
  arguments?: string;
}

function concatenateFunctionInfo(events: Event[]): [string, string] {
  let functionName: string = '';
  let functionArguments: string = '';

  events.forEach((event) => {
    const delta: Delta = event.choices[0].delta;
    const contentPiece: string | undefined = delta.content;
    const functionCall: FunctionCall | undefined = delta.function_call;

    if (contentPiece === null && functionCall) {
      const tmpFuncName: string | undefined = functionCall.name;
      functionName = tmpFuncName ? tmpFuncName : functionName;
      functionArguments += functionCall.arguments ? functionCall.arguments : '';
    }
  });

  return [functionName, functionArguments];
}

export const handleAsyncRequest = async (
  setAnswers: Function,
  responseBody: ReadableStream<any>,
  onFunctionExecution?: Function
) => {
  let answer: string = '';
  let thoughts: any[] = [];
  let eventsFunc: any[] = [];
  let askResponse: ChatAppResponse = {} as ChatAppResponse;

  const updateState = (newContent: string, status?: 'idle' | 'running') =>
    new Promise((resolve) => {
      answer += newContent;
      setAnswers(answer, thoughts, status ? status : 'running');
      resolve(null);
    });
  // new Promise((resolve) => {
  //    setTimeout(() => {
  //      answer += newContent;
  //      setAnswers(answer);
  //      resolve(null);
  //    }, 50);
  //  });
  // );

  try {
    for await (const event of readNDJSONStream(responseBody)) {
      // console.log('event: ', event);
      const finishReason = event.choices[0].finish_reason || null;
      // console.log('finishReason: ', finishReason);
      if (event.choices && event.choices[0].context && event.choices[0].context.thoughts) {
        thoughts =
          event.choices[0].context.thoughts.length > 0 ? event.choices[0].context.thoughts : [];
        event.choices[0].message = event.choices[0].delta;
        askResponse = event as ChatAppResponse;
      } else if (event.choices && event.choices[0].delta.content) {
        await updateState(event.choices[0].delta.content);
      } else if (event.choices && event.choices[0].context) {
        askResponse.choices[0].context = {
          ...askResponse.choices[0].context,
          ...event.choices[0].context,
        };
      } else if (event.choices && event.choices[0].delta.function_call) {
        eventsFunc.push(event);
      } else if (finishReason === 'function_call') {
        const functionInfo = concatenateFunctionInfo(eventsFunc);
        if (onFunctionExecution) onFunctionExecution(functionInfo[0], functionInfo[1]);
        // if (onSend) executeFunction(functionInfo[0], functionInfo[1], onSend);
        // console.log(functionInfo);
      } else if (finishReason === 'stop' || finishReason === 'length') {
        await updateState('', 'idle');
      } else if (event.error) {
        throw Error(event.error);
      }
    }
  } catch (error) {
    setAnswers(error.message);
  }
};

export async function chatApi(
  request: ChatAppRequest,
  idToken: string | undefined,
  aoaiConfig: Record<string, string>,
  streaming?: boolean
): Promise<Response> {
  // const token = await getToken();
  return fetch(`${BACKEND_API}/aoai`, {
    method: 'POST',
    headers: getHeaders(idToken),
    // headers: getHeaders(token),
    body: JSON.stringify({
      ...request,
      aoai_config: aoaiConfig,
      ...(streaming !== undefined && { stream: streaming }),
    }),
  });
}

export async function aoaiVisionApi(
  messages: ResponseMessage[],
  idToken: string | undefined,
  sendMessage: Function,
  aoaiConfig: Record<string, string>,
  systemPrompt?: string
) {
  const payload = {
    enhancements: {
      ocr: {
        enabled: true,
      },
      grounding: {
        enabled: true,
      },
    },
    messages: [systemPrompt && { role: 'system', content: systemPrompt }, ...messages],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 2000,
    stream: true,
  };

  const GPT4V_ENDPOINT = `${aoaiConfig.azure_endpoint}openai/deployments/${aoaiConfig.deployment}/extensions/chat/completions?api-version=${aoaiConfig.api_version}`;

  let answer: string = '';
  const updateState = (newContent: string) =>
    new Promise((resolve) => {
      answer += newContent;
      sendMessage(answer);
      resolve(null);
    });

  try {
    await fetch(GPT4V_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': aoaiConfig.api_key,
        Connection: 'keep-alive',
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      // console.log(response);
      if (response && response.status > 299) {
        const content = `Error: ${response.status}  ${response.statusText}`;
        sendMessage(content, 'assistant', [], 'new', []);
        return;
      }

      if (response.body !== null) {
        const reader = response.body.getReader();

        let done = false;
        while (!done) {
          const { done: isDone, value } = await reader.read();
          done = isDone;
          if (done) break;
          const text = new TextDecoder('utf-8').decode(value);

          const items = text.split('data:');
          for (const item of items) {
            try {
              const daObject = JSON.parse(item);
              const content = daObject?.choices?.[0]?.messages?.[0]?.delta?.content;
              if (content && !content.startsWith(`{"grounding"`)) {
                updateState(content);
              }
            } catch (error) {
              console.error(error);
            }
          }

          // for await (const item of text.split('data:')) {
          //   try {
          //     const daObject = JSON.parse(item);
          //     const content = daObject?.choices?.[0]?.messages?.[0]?.delta?.content;
          //     if (content && !content.startsWith(`{"grounding"`)) {
          //       await updateState(content);
          //     }
          //   } catch (error) {
          //     console.error(error);
          //   }
          // }
        }
      }
    });
  } catch (error) {
    sendMessage(error.message, 'assistant', [], 'new', []);
  }
}

export const askApi = async (
  request: ChatAppRequest,
  idToken: string | undefined,
  indexName: string | undefined,
  embeddingConfig: Record<string, string>,
  aoaiConfig: Record<string, string>
): Promise<Response> => {
  if (!indexName) return null as any;
  return fetch(`${BACKEND_API}/chat`, {
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
  selectedTools?: ITool[];
};

export const makeApiRequest = async ({
  mode,
  onSend,
  request,
  shouldStream,
  aoaiResourceName,
  indexName = undefined,
  buttonContent = undefined,
  systemPrompt = undefined,
  messageId = undefined,
  selectedTools = [],
}: Props) => {
  try {
    const setResponse = (response: any, thoughts?: any[], status?: 'idle' | 'running') => {
      if (!messageId) {
        onSend({
          content: response,
          senderId: 'assistant',
          mode: 'attach',
          msgId: uuidv4(),
          status: status ? status : 'idle',
          ...(thoughts && thoughts.length > 0 && { thoughts }),
        });
      } else {
        // For ChatDA
        onSend(messageId, response, 'completed');
      }
    };

    const handleExecuteFunction = (funcName: string, funcArgs: string) => {
      const selectedTool =
        selectedTools.filter((_tool) => _tool.meta.includes(funcName))[0] || null;
      executeFunction(funcName, funcArgs, selectedTool, onSend);
    };

    const reformedMessages = request.messages.map(async (message) => {
      const { role, content, attachments, name, function_call, sources } = message;

      let newContent = content;
      if (sources && sources.length > 0) {
        // Regular expression to check if a string is a valid URL
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

        // Filter out invalid URLs
        const validSources = sources.filter((source) => urlRegex.test(source.url));

        if (validSources.length > 0) {
          const webContents = await Promise.all(
            sources.map(async (source) => {
              const webContent = await convertWebToMD(source.url);
              return `${source.url}\n${webContent}`;
            })
          ).then((contents) => contents.join('\n\n'));

          newContent = `${content} \n\n You can refer to the web information below: \n ${webContents}`;
        }
      }

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
        return { role, content: [...imgContents, { type: 'text', text: newContent }] };
      }
      return {
        role,
        content: newContent,
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
    if (mode === 'open-chat') {
      response = await chatApi(reformedRequest, undefined, aoai);
      // console.log(response);
      // await aoaiVisionApi(reformedRequest.messages, undefined, setResponse)
    } else if (mode === 'rag') {
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
      response = await chatApi(reformedRequest, undefined, aoai);
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
    if (shouldStream) {
      // if (shouldStream && mode !== 'function-calling') {
      await handleAsyncRequest(setResponse, response.body, handleExecuteFunction);
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

const handleAsyncChunk = async (
  msgId: string,
  setAnswers: Function,
  setSources: Function,
  setVideos: Function,
  responseBody: ReadableStream<any>
) => {
  let answer: string = '';

  const updateState = (newContent: string) =>
    new Promise((resolve) => {
      answer += newContent;
      setAnswers(msgId, answer, 'completed');
      resolve(null);
    });
  // new Promise((resolve) => {
  //   setTimeout(() => {
  //     answer += newContent;
  //     setAnswers(msgId, answer, 'completed');
  //     resolve(null);
  //   }, 13);
  // });
  // );

  try {
    for await (const event of readNDJSONStream(responseBody)) {
      // console.log('event');
      // console.log(typeof event);
      // console.log(event);

      const lines = event.split('\n');
      /* eslint-disable no-restricted-syntax */
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          try {
            const data = JSON.parse(jsonStr);
            if (Object.prototype.hasOwnProperty.call(data, 'api_search')) {
              const { api_search } = data;
              if (api_search && typeof api_search.news === 'object') {
                const src = Object.entries(api_search.news).map(([url, value]) => {
                  const { snippet } = value as { snippet: string };
                  return { url, label: snippet };
                });

                setSources(msgId, src, 'completed');
              } else {
                console.error('api_search or api_search.news is not defined or not an object');
              }
            }

            if (Object.prototype.hasOwnProperty.call(data, 'custom_search')) {
              const { custom_search } = data;
              // console.log(data.custom_search);
              if (custom_search && typeof custom_search.videos === 'object') {
                const vids = Object.entries(custom_search.videos).map(([url, snippet]) => ({
                  url,
                  snippet,
                }));

                setVideos(msgId, vids, 'completed');
              } else {
                console.error(
                  'custom_search or custom_search.videos is not defined or not an object'
                );
              }
            }

            if (Object.prototype.hasOwnProperty.call(data, 'answer')) {
              await updateState(data.answer);
            }
            // Outputs: { answer: " " }, { answer: "202" }, { answer: "4" }, etc.
          } catch (error) {
            console.error('Invalid JSON:', jsonStr);
          }
        }
      }
      /* eslint-disable no-restricted-syntax */
    }
  } catch (error) {
    setAnswers(error.message);
  }
};

export async function handlePerplexityCall(
  endpoint: string,
  key: string,
  msgId: string,
  query: string,
  onUpdateContent: (messageId: string, content: string, status: string) => void,
  setSources: Function,
  setVideos: Function
) {
  try {
    const response = await fetch(`${BACKEND_API}/perplexity`, {
      method: 'POST',
      headers: getHeaders('123'),
      body: JSON.stringify({ endpoint, key, query }),
    });
    if (response && response.body)
      await handleAsyncChunk(msgId, onUpdateContent, setSources, setVideos, response.body);
  } catch (error) {
    onUpdateContent(msgId, JSON.stringify(error), 'failed');
  }
}
