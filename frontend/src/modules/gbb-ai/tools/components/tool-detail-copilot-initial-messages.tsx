import { Message } from 'src/types/chat';

// ----------------------------------------------------------------------
export const codeInitialMessges = (context: string) => [
  {
    id: '123',
    body: 'Hi, what would you like me to do with your code? You can select from the options below, or you can send me a message.',
    contentType: 'text',
    sources: [],
    function_calls: [],
    buttons: [
      {
        button_id: '1',
        button_content: 'Review code',
        button_prompt: `Review following codes, detect the programming language first, and then review the code: ${context}`,
      },
      {
        button_id: '2',
        button_content: 'Explain code',
        button_prompt: `Read following codes, detect the programming language first, and then explain the code: ${context}`,
      },
      {
        button_id: '3',
        button_content: 'Rewrite code',
        button_prompt: `Read following codes, detect the programming language first, and then rewrite the code using the same programming language: \n\n${context}`,
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
