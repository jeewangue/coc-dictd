import assert from 'node:assert';
import { logger } from '../logger';

export class Definition {
  word: string;
  dbName: string;
  dbDesc: string;
  definition: string;

  constructor(word = '', dbName = '', dbDesc = '', definition = '') {
    this.word = word;
    this.dbName = dbName;
    this.dbDesc = dbDesc;
    this.definition = definition;
  }
}

export class Match {
  dbName: string;
  word: string;
  constructor(dbName = '', word = '') {
    this.word = word;
    this.dbName = dbName;
  }
}

export interface ParseResult {
  found: boolean;
  count: number;
  defs: Definition[];
  matches: Match[];
}

interface ParseContext extends ParseResult {
  mode: Mode;
  code: number;
  def: Definition | null;
  match: Match | null;
}

enum Mode {
  Response,
  TextFollows,
}

const parseResponse = (line: string): string[] => {
  const regex = /(?:\s*(?:"(?<v1>[^\"]*)"|(?<v2>[^ ]+))\s*)+?/g;
  const matches = line.matchAll(regex);
  const results: string[] = [];
  for (const match of matches) {
    if (match.groups) {
      results.push(match.groups.v1 ?? match.groups.v2);
    }
  }
  return results;
};

export const parse = (txt: string): ParseResult => {
  const ctx: ParseContext = {
    mode: Mode.Response,
    code: 0,
    found: false,
    count: 0,
    def: null,
    defs: [],
    match: null,
    matches: [],
  };

  const lines = txt.split(/\r?\n/);

  for (const line of lines) {
    if (ctx.mode === Mode.Response) {
      if (line.match(/^\d{3}/) === null) {
        continue;
      }

      ctx.code = parseInt(line.slice(0, 3));

      if (ctx.code === 150) {
        ctx.found = true;
        const res = parseResponse(line.slice(3));
        ctx.count = parseInt(res[0]);
        logger.debug(`${ctx.count} definitions retrieved`);
      } else if (ctx.code === 151) {
        const res = parseResponse(line.slice(3));
        ctx.def = new Definition(res[0], res[1], res[2]);
        ctx.mode = Mode.TextFollows;
      } else if (ctx.code === 152) {
        ctx.found = true;
        const res = parseResponse(line.slice(3));
        ctx.count = parseInt(res[0]);
        logger.debug(`${ctx.count} matches found`);
        ctx.mode = Mode.TextFollows;
      } else if (ctx.code === 552) {
        ctx.found = false;
      }
    } else if (ctx.mode === Mode.TextFollows) {
      if (ctx.code === 151) {
        assert(ctx.def instanceof Definition);
        if (line === '.') {
          ctx.defs.push(ctx.def);
          ctx.mode = Mode.Response;
          ctx.def = null;
        } else {
          ctx.def.definition += line + '\n';
        }
      } else if (ctx.code === 152) {
        if (line === '.') {
          ctx.mode = Mode.Response;
        } else {
          const res = parseResponse(line);
          ctx.matches.push(new Match(res[0], res[1]));
        }
      }
    }
  }

  return ctx;
};
