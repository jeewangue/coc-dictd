import { activateHelper } from 'coc-helper';
import { Documentation, ExtensionContext, FloatFactory, FloatWinConfig, window, workspace } from 'coc.nvim';
import { map, uniq } from 'lodash-es';
import util from 'util';
import { setExtConfig } from './config';
import { getDefs, getMatches } from './dict';
import { logger } from './logger';

export async function activate(context: ExtensionContext): Promise<void> {
  await activateHelper(context);
  logger.info('coc-dictd works!');

  {
    const c = workspace.getConfiguration('dictd');
    setExtConfig(c);
  }

  const ff = new FloatFactory(workspace.nvim);
  const floatConfig: FloatWinConfig = {
    border: [1, 1, 1, 1],
  };

  context.subscriptions.push(
    ff,
    workspace.onDidChangeConfiguration((ev) => {
      logger.debug('config changed');
      if (ev.affectsConfiguration('dictd')) {
        logger.debug('config change affected coc-dictd');
        const c = workspace.getConfiguration('dictd', workspace.root);
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
    )
  );
}
