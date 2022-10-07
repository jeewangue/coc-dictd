import {
  Formality,
  Language,
  ListLanguagesCommand,
  TranslateClient,
  TranslateTextCommand,
  TranslateTextCommandInput,
} from '@aws-sdk/client-translate';
import { includes, compact, isEmpty, isUndefined, map } from 'lodash-es';

interface TranslateContext {
  cli: TranslateClient;
  languages: Language[];
  languageCodes: string[];
}

const ctx: TranslateContext = {
  cli: new TranslateClient({}),
  languages: [],
  languageCodes: [],
};

const prepare = async (): Promise<void> => {
  const command = new ListLanguagesCommand({});
  const data = await ctx.cli.send(command);
  if (isUndefined(data.Languages)) {
    throw new Error('failed to fetch available languages.');
  }
  ctx.languages = data.Languages;
  ctx.languageCodes = compact(map(data.Languages, (v) => v.LanguageCode));
};

export interface TranslateInput {
  formality: 'formal' | 'informal' | 'none';
  sourceLanguageCode: string;
  targetLanguageCode: string;
  text: string;
}

export const translate = async (opts: TranslateInput): Promise<string> => {
  const sl = opts.sourceLanguageCode;
  const tl = opts.targetLanguageCode;
  const formailty = {
    formal: Formality.FORMAL,
    informal: Formality.INFORMAL,
    none: undefined,
  }[opts.formality];
  const text = opts.text;

  if (isEmpty(ctx.languages)) {
    await prepare();
  }
  if (!includes(ctx.languageCodes, sl)) {
    throw new Error(`not supported language code: ${sl}`);
  }
  if (!includes(ctx.languageCodes, tl)) {
    throw new Error(`not supported language code: ${tl}`);
  }

  const params: TranslateTextCommandInput = {
    SourceLanguageCode: sl,
    TargetLanguageCode: tl,
    Text: text,
    Settings: {
      Formality: formailty,
    },
  };
  const command = new TranslateTextCommand(params);
  const data = await ctx.cli.send(command);
  console.info(data.TranslatedText);
  if (isUndefined(data.TranslatedText)) {
    throw new Error('translated text is empty.');
  }
  return data.TranslatedText;
};
