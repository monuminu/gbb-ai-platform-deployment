import { changelog } from './changelog';
import { dashboard } from './functions';
import { createAKb, chatWithKb } from './kmm';
import { setupToUse, introduction } from './preperation';
import { createACustomGpt, orchestrateCustomGpts } from './gpts';
import { chatDa, tvCopilot, aoaiWorkbench } from './applications';

// ----------------------------------------------------------------------

export default function getContents(section: string) {
  // Get started
  if (section === 'introduction') return { localcontent: introduction, isLoadingLocal: false };
  if (section === 'setup-to-use') return { localcontent: setupToUse, isLoadingLocal: false };
  // CHANGELOG
  if (section === 'changelog') return { localcontent: changelog, isLoadingLocal: false };
  // Functions
  if (section === 'functions-preview') return { localcontent: dashboard, isLoadingLocal: false };
  // KB
  if (section === 'create-kb') return { localcontent: createAKb, isLoadingLocal: false };
  if (section === 'chat-with-kb') return { localcontent: chatWithKb, isLoadingLocal: false };
  // APP
  if (section === 'tv-copilot') return { localcontent: tvCopilot, isLoadingLocal: false };
  if (section === 'ai-data-analyzer') return { localcontent: chatDa, isLoadingLocal: false };
  if (section === 'aoai-workbench') return { localcontent: aoaiWorkbench, isLoadingLocal: false };
  // GPTs
  if (section === 'create-custom-gpt')
    return { localcontent: createACustomGpt, isLoadingLocal: false };
  if (section === 'orchestrate-custom-gpts')
    return { localcontent: orchestrateCustomGpts, isLoadingLocal: false };

  return { localcontent: null, isLoadingLocal: false };
}
