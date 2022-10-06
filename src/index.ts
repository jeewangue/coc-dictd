import util from 'util';
import { Documentation, ExtensionContext, FloatFactory, FloatWinConfig, window, workspace } from 'coc.nvim';
import { map, uniq } from 'lodash-es';
import { getDefs, getMatches } from './dict';
import { logger } from './logger';
import { activateHelper } from 'coc-helper';
import { extConfig } from './config';

export async function activate(context: ExtensionContext): Promise<void> {
  await activateHelper(context);
  logger.info('coc-dictd works!');

  const config = workspace.getConfiguration('coc-dictd');
  if (config.has('server')) {
    extConfig.server = config.get('server', 'dict.org');
  }
  if (config.has('timeout')) {
    extConfig.timeout = parseInt(config.get('timeout', '5000'));
  }
  if (config.has('databases')) {
    extConfig.databases = config.get('databases', '*');
  }

  const ff = new FloatFactory(workspace.nvim);
  const floatConfig: FloatWinConfig = {
    border: [1, 1, 1, 1],
  };

  context.subscriptions.push(
    workspace.registerKeymap(
      ['n'],
      'dictd-search',
      async () => {
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
