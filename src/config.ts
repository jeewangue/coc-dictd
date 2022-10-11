import { WorkspaceConfiguration } from 'coc.nvim';

export type ExtConfig = {
  server: string;
  timeout: number;
  databases: string;
};
export const extConfig: ExtConfig = {
  server: 'dict.org',
  timeout: 5000,
  databases: '*',
};

export const setExtConfig = (c: WorkspaceConfiguration) => {
  extConfig.server = c.get<string>('server', 'dict.org');
  extConfig.timeout = c.get<number>('timeout', 5000);
  extConfig.databases = c.get<string>('databases', '*');
};
