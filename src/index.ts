import { activateHelper } from 'coc-helper';
import { Documentation, ExtensionContext, FloatFactory, FloatWinConfig, window, workspace } from 'coc.nvim';
import { map, uniq } from 'lodash-es';
import util from 'util';
import { extConfig, setExtConfig } from './config';
import { getDefs, getMatches } from './dict';
import { logger } from './logger';
import { translate } from './translate';

export async function activate(context: ExtensionContext): Promise<void> {
  await activateHelper(context);
  logger.info('coc-dictd works!');

  {
    const c = workspace.getConfiguration('coc-dictd');
    setExtConfig(c);
  }

  const ff = new FloatFactory(workspace.nvim);
  const floatConfig: FloatWinConfig = {
    border: [1, 1, 1, 1],
  };

  context.subscriptions.push(
    workspace.onDidChangeConfiguration((ev) => {
      logger.debug('config changed');
      if (ev.affectsConfiguration('coc-dictd')) {
        logger.debug('config change affected coc-dictd');
        const c = workspace.getConfiguration('coc-dictd');
        setExtConfig(c);
      }
    }),
    workspace.registerKeymap(
      ['n'],
      'dictd-search',
      async () => {
        logger.info('coc-dictd-search');
        let word = (await workspace.nvim.eval('expand("<cword>")')) as string;
        {
          const res = await getDefs(word);
          logger.debug('definitions');
          logger.debug(util.inspect(res));
          if (res.found) {
            const docs = [
              { filetype: 'log', content: `${res.count} definition(s) found.` },
              ...res.defs.map(
                (def): Documentation => ({
                  filetype: 'log',
                  content: `From "${def.dbName}":\n\n${def.definition}`,
                })
              ),
            ];
            return ff.show(docs, floatConfig);
          }
        }

        {
          const res = await getMatches(word, 'lev');
          logger.debug('matches');
          logger.debug(util.inspect(res));
          if (res.found) {
            const wordsCandidate = uniq(map(res.matches, (v) => v.word.toLowerCase())).sort();

            const idx = await window.showMenuPicker(wordsCandidate, `${wordsCandidate.length} match(es) found.`);
            if (idx === -1) {
              return;
            }
            word = wordsCandidate[idx];
          } else {
            return ff.show([{ filetype: 'markdown', content: `No matches found for \`${word}\`.` }], floatConfig);
          }
        }

        {
          const res = await getDefs(word);
          logger.debug('definitions');
          logger.debug(util.inspect(res));
          if (res.found) {
            const docs = [
              { filetype: 'log', content: `${res.count} definition(s) found.` },
              ...res.defs.map(
                (def): Documentation => ({
                  filetype: 'log',
                  content: `From "${def.dbName}":\n\n${def.definition}`,
                })
              ),
            ];
            return ff.show(docs, floatConfig);
          } else {
            return ff.show([{ filetype: 'markdown', content: `No definition found for \`${word}\`.` }], floatConfig);
          }
        }
      },
      { sync: false }
    ),
    workspace.registerKeymap(
      ['n'],
      'dictd-translate',
      async () => {
        logger.info('coc-dictd-translate');
        const word = (await workspace.nvim.eval('expand("<cword>")')) as string;
        {
          const res = await translate({
            formality: extConfig.translate.formality,
            sourceLanguageCode: extConfig.translate.sourceLanguageCode,
            targetLanguageCode: extConfig.translate.targetLanguageCode,
            text: word,
          });
          logger.debug('translate');
          logger.debug(util.inspect(res));
          const docs = [{ filetype: 'log', content: res }];
          return ff.show(docs, floatConfig);
        }
      },
      { sync: false }
    ),
    workspace.registerKeymap(
      ['v'],
      'dictd-translate-selected',
      async () => {
        logger.info('coc-dictd-translate-selected');
        const range = await window.getSelectedRange('v');
        if (range === null) {
          logger.warn('range is empty');
          return;
        }

        const doc = await workspace.document;
        const lines = doc.getLines(range.start.line, range.end.line + 1);
        if (lines.length === 0) {
          logger.warn('no lines are selected');
          return;
        }
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, range.end.character);
        lines[0] = lines[0].slice(range.start.character);

        const text = lines.join('\n');
        logger.info(`selected text: ${util.inspect(text)}`);
        {
          const res = await translate({
            formality: extConfig.translate.formality,
            sourceLanguageCode: extConfig.translate.sourceLanguageCode,
            targetLanguageCode: extConfig.translate.targetLanguageCode,
            text: text,
          });
          logger.debug('translate');
          logger.debug(util.inspect(res));
          const docs = [{ filetype: 'log', content: res }];
          return ff.show(docs, floatConfig);
        }
      },
      { sync: false }
    )
  );
}
