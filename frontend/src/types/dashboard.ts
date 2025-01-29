// ----------------------------------------------------------------------

export type IDashboardFilterValue = string | string[] | Date | null;

export type IDashboardFilters = {
  name: string;
  tags: string[];
  statuses: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IDashboardShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

// ----------------------------------------------------------------------

export type IDashboardManager = {
  id: string;
  name: string;
  size: number;
  url: string;
  code: string;
  meta: string;
  dependencies: string[];
  description: string;
  params: any[];
  type: string;
  tags: string[];
  isFavorited: boolean;
  status: string;
  shared: IDashboardShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
  activity: number[];
  cover: string;
  entryFunction: string;
  envVars: { key: string; value: string }[];
  response: string;
  apiAuth: { type: string; apiKey: string; authType: string } | null;
};

export type IDashboard = IDashboardManager;
