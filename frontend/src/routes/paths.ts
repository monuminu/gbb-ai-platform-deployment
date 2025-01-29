// ----------------------------------------------------------------------

const ROOTS_GBB = '/gbb-ai';

// ----------------------------------------------------------------------

export const paths = {
  page404: '/404',
  // DOC
  documentation: {
    root: `${ROOTS_GBB}/documentation`,
    introduction: `${ROOTS_GBB}/documentation/introduction`,
    setupToUse: `${ROOTS_GBB}/documentation/setup-to-use`,
    kmm: {
      create: `${ROOTS_GBB}/documentation/create-kb`,
      chat: `${ROOTS_GBB}/documentation/chat-with-kb`,
    },
    functions: {
      preview: `${ROOTS_GBB}/documentation/functions-preview`,
    },
    gpts: {
      create: `${ROOTS_GBB}/documentation/create-custom-gpt`,
      orchestrate: `${ROOTS_GBB}/documentation/orchestrate-custom-gpts`,
    },
    applications: {
      aoaiWorkbench: `${ROOTS_GBB}/documentation/aoai-workbench`,
      tvCopilot: `${ROOTS_GBB}/documentation/tv-copilot`,
      chatDa: `${ROOTS_GBB}/documentation/ai-data-analyzer`,
    },
    author: `${ROOTS_GBB}/documentation/about-author`,
    faqs: `${ROOTS_GBB}/documentation/faqs`,
    changeLog: `${ROOTS_GBB}/documentation/changelog`,
  },
  // AUTH
  auth: {
    ad: {
      login: `/auth/ad/login`,
    },
  },
  // GBBAI
  gbbai: {
    root: ROOTS_GBB,
    kb: {
      root: `${ROOTS_GBB}/kb`,
      details: (id: string) => `${ROOTS_GBB}/kb/${id}`,
      edit: (id: string) => `${ROOTS_GBB}/kb/${id}/edit`,
    },
    function: {
      root: `${ROOTS_GBB}/function`,
      details: (id: string) => `${ROOTS_GBB}/function/${id}`,
      edit: (id: string) => `${ROOTS_GBB}/function/${id}/edit`,
    },
    gpts: {
      root: `${ROOTS_GBB}/gpts`,
      create: `${ROOTS_GBB}/gpts/create`,
      details: (id: string) => `${ROOTS_GBB}/gpts/${id}`,
      edit: (id: string) => `${ROOTS_GBB}/gpts/edit/${id}`,
      workbench: `${ROOTS_GBB}/gpts/workbench`,
    },
    appGallery: {
      root: `${ROOTS_GBB}/app-gallery`,
      details: (id: string) => `${ROOTS_GBB}/app-gallery/${id}`,
      edit: (id: string) => `${ROOTS_GBB}/app-gallery/${id}/edit`,
      customGpt: {
        create: `${ROOTS_GBB}/app-gallery/custom-gpt/create`,
        edit: (id: string) => `${ROOTS_GBB}/app-gallery/custom-gpt/edit/${id}`,
      },
    },
    user: {
      root: `${ROOTS_GBB}/user`,
      account: `${ROOTS_GBB}/user/account`,
    },
  },
};
