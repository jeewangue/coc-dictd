import { WorkspaceConfiguration } from 'coc.nvim';

export type Formality = 'formal' | 'informal' | 'none';
export type ExtConfig = {
  server: string;
  timeout: number;
  databases: string;
  translate: {
    formality: Formality;
    sourceLanguageCode: string;
    targetLanguageCode: string;
  };
};
export const extConfig: ExtConfig = {
  server: 'dict.org',
  timeout: 5000,
  databases: '*',
  translate: {
    formality: 'none',
    sourceLanguageCode: 'auto',
    targetLanguageCode: 'en',
  },
};

export const setExtConfig = (c: WorkspaceConfiguration) => {
  extConfig.server = c.get<string>('server', 'dict.org');
  extConfig.timeout = c.get<number>('timeout', 5000);
  extConfig.databases = c.get<string>('databases', '*');

  extConfig.translate.formality = c.get<Formality>('translate.formality', 'none');
  extConfig.translate.sourceLanguageCode = c.get<string>('translate.sourceLanguageCode', 'auto');
  extConfig.translate.targetLanguageCode = c.get<string>('translate.targetLanguageCode', 'en');
};
