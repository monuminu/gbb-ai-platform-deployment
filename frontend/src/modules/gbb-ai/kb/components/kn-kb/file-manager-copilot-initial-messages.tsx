import { Message } from 'src/types/chat';
import { RagSourceManager } from 'src/types/kb';

// ----------------------------------------------------------------------
export const createInitialMessges = (index: string, kbs: RagSourceManager[]) => {
  const initMsg = {
    id: '123',
    body: `👋  I'm here to chat with you. <br/> Please selecte one Knowledge base.`,
    contentType: 'text',
    sources: [],
    function_calls: [],
    buttons: [],
    createdAt: new Date(),
    senderId: 'e12f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    mode: 'new',
    chatMode: 'rag',
  } as Message;

  if (index === '') return [initMsg];

  if (kbs.length > 0) {
    let body = `👋  I'm here to chat with you, guided by the <strong>Indexed</strong> files you've chosen from the list.`;

    if (kbs[0].type.toLowerCase() === 'kb') {
      if (kbs.length > 1)
        body = `👋  I'm here to chat with you, guided by the knowledge base you've chosen from the list. <br/> Only one knowledge base will be used.`;
      else body = body.replace('files', 'knowledge abse');

      return [
        {
          ...initMsg,
          body,
          sources: [{ label: kbs[0].name, url: 'folder' }],
        },
      ];
    }
    return [
      {
        ...initMsg,
        body,
        sources: kbs
          .filter((kb) => kb.status === 'Indexed')
          .map((kb) => ({ label: kb.name, url: kb.type })),
      },
    ];
  }

  return [
    {
      ...initMsg,
      body: `👋  I'm here to have a chat with you, pulling from this <strong>entire</strong> knowledge base.`,
    },
  ];
};
