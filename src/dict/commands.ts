import { ChildProcess, spawn } from 'node:child_process';
import { extConfig } from '../config';
import { logger } from '../logger';
import { parse, ParseResult } from './parse';

const runCmdAsync = (cmd: ChildProcess) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    if (cmd.stdout === null || cmd.stderr === null) {
      logger.warn("command's output stream is null");
    }

    cmd.stdout?.setEncoding('utf8');
    cmd.stdout?.on('data', (data: string) => {
      stdout += data;
    });

    cmd.stderr?.setEncoding('utf8');
    cmd.stderr?.on('data', (data: string) => {
      stderr += data;
    });

    cmd.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`child process exited with code ${code}`));
      } else {
        resolve({
          stdout,
          stderr,
        });
      }
    });

    cmd.on('error', (err) => {
      stderr += 'Failed to start subprocess.\n';
      stderr += err.message;
      reject(new Error(stderr));
    });
  });

export const getDefs = async (word: string): Promise<ParseResult> => {
  const cmd = spawn('curl', ['-s', `dict://${extConfig.server}/d:${word}:${extConfig.databases}`], {
    timeout: extConfig.timeout,
  });

  const { stdout } = await runCmdAsync(cmd);
  return parse(stdout);
};

export const getMatches = async (word: string, matchStrategy = 'lev'): Promise<ParseResult> => {
  const cmd = spawn('curl', ['-s', `dict://${extConfig.server}/m:${word}:${extConfig.databases}:${matchStrategy}`], {
    timeout: extConfig.timeout,
  });

  const { stdout } = await runCmdAsync(cmd);
  return parse(stdout);
};
