export const extConfig: {
  server: string;
  timeout: number;
  databases: string;
  translate: {
    formality: 'formal' | 'informal' | 'none';
    sourceLanguageCode: string;
    targetLanguageCode: string;
  };
} = {
  server: 'dict.org',
  timeout: 5000,
  databases: '*',
  translate: {
    formality: 'none',
    sourceLanguageCode: 'auto',
    targetLanguageCode: 'en',
  },
};
