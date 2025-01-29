import { Message } from 'src/types/chat';

// ----------------------------------------------------------------------
export const initialMessges = (context: string) => [
  {
    id: '123',
    body: `Hi! I'll help you build a custom GPT. Once you've named your GPT, I'll walk you through the rest.`,
    contentType: 'text',
    sources: [],
    function_calls: [],
    buttons: [
      {
        button_id: '1',
        button_content: 'Generate description',
        button_prompt: `Please generate a short description for a custom GPT named ${context} around 30 words.`,
      },
      {
        button_id: '2',
        button_content: 'Generate system prompt',
        button_prompt: `I want you to help me write a detailed instruction (system prompt) for a custom GPT named ${context}. It should start like: "You are a helpful ...". The total number of words should be no more than 200.`,
      },
      {
        button_id: '3',
        button_content: 'Generate 3 sample prompts',
        button_prompt: `Please generate 3 sample prompts for a custom GPT named ${context}. Each prompt should be more than 15 words but less than 30 words.`,
      },
    ],
    createdAt: new Date(),
    senderId: 'e12f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    mode: 'new',
    chatMode: 'open-chat',
  } as Message,
];

export const metaInitialMessges = (context: string) => [
  {
    id: '123',
    body: `Hello, I can help you generate function definitions based on your code, following the format required by Azure OpenAI's function calling APIs.`,
    contentType: 'text',
    sources: [],
    function_calls: [],
    buttons: [
      {
        button_id: '1',
        button_content: 'Generate definition',
        button_prompt: `Read the codes, and then generate the function description using the given json format.
        
        ##codes:
        ${context}
        
        ##JSON format
        {
          "name": "xxx",
          "description": "xxx",
          "parameters": {
              "type": "object",
              "properties": {
                  "parameter 1": {
                      "type": "xxx",
                      "description": "xxx"
                  },
                  "parameter 2": {
                    "type": "xxx",
                    "description": "xxx"
                }
              },
              "required": ["parameter 1", xxx]
          }
        }
        `,
      },
    ],
    createdAt: new Date(),
    senderId: 'e12f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    mode: 'new',
    chatMode: 'open-chat',
  } as Message,
];
