import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import moment = require('moment');
const chalk = require('chalk');
const cluster = require('cluster');

export type logMethodLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LoggerOptions {
  projectName?: string;
  momentFormat?: string;
  environment?: 'browser' | 'node';
  logFileFolder?: string;
  level?: logMethodLevel;
}

const colors = {
  debug: chalk.green,
  info: chalk.green,
  warn: chalk.keyword('orange'),
  error: chalk.red
};

const levelNumber = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;

  loggerOptions: LoggerOptions = {
    environment: 'node',
    level: 'info',
    momentFormat: 'YYYY-MM-DD HH:mm:ss'
  };

  constructor(options: LoggerOptions) {
    this.loggerOptions = Object.assign(this.loggerOptions, options);
  }
}

['debug', 'info', 'warn', 'error'].forEach((type: logMethodLevel, index: number) => {
  Logger.prototype[type] = function(...args: any[]) {
    const { projectName, environment, logFileFolder, momentFormat, level } = this.loggerOptions;

    if (index >= levelNumber[level as logMethodLevel]) {
      // format the input args as a string
      let inputArgs = JSON.stringify(args);
      let time: string = new Date().toString();
      const unshiftAppanders = [];

      if (projectName) {
        unshiftAppanders.push(`${projectName}`);
      }
      if (cluster.isWorker) {
        unshiftAppanders.push(`workerID:${cluster.worker.id}`);
      }
      if (momentFormat) {
        time = moment().format(momentFormat);
      }
      unshiftAppanders.push(time);
      unshiftAppanders.push(`[${type.toUpperCase()}]`);
      // remove [] from stringify
      inputArgs = inputArgs.substr(1, inputArgs.length - 2);
      unshiftAppanders.push(inputArgs);

      const msg = unshiftAppanders.join(' ');
      console.log(colors[type](msg));
      // write file
      if (environment === 'node' && logFileFolder) {
        const logFolder = join(process.cwd(), logFileFolder);
        if (!existsSync(logFolder)) {
          mkdirSync(logFolder);
        }

        const fileName = moment().format('YYYYMMDD') + '.log';
        const logFilePath = join(process.cwd(), logFileFolder, fileName);
        // create or update file
        const stream = createWriteStream(logFilePath, {
          flags: 'a+'
        });

        stream.write(`${msg}\r\n`);
        stream.end();
      }
    }
  };
});

export default Logger;
