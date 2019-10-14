import { createWriteStream } from 'fs';
import { join } from 'path';
import moment = require('moment');
const chalk = require('chalk');
const cluster = require('cluster');

type logMethodLevel = 'debug' | 'info' | 'warn' | 'error';
interface LoggerOptions {
  projectName?: string;
  momentFormat?: string;
  environment?: 'browser' | 'node';
  logFilePath?: string;
}

const colors = {
  debug: chalk.green,
  info: chalk.green,
  warn: chalk.keyword('orange'),
  error: chalk.red
};

class Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;

  loggerOptions: LoggerOptions = {
    environment: 'node'
  };

  constructor(options: LoggerOptions) {
    this.loggerOptions = Object.assign(this.loggerOptions, options);
  }
}

['debug', 'info', 'warn', 'error'].forEach((level: logMethodLevel) => {
  Logger.prototype[level] = function(...args: any[]) {
    const {
      projectName,
      environment,
      logFilePath,
      momentFormat
    } = this.loggerOptions;
    let inputArgs = args;
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
    unshiftAppanders.push(`[${level.toUpperCase()}]`);

    inputArgs = unshiftAppanders.concat(args);
    const msg = inputArgs.join(' ');

    console.log(colors[level](msg));

    // console[level].apply(console, inputArgs);

    if (environment === 'node' && logFilePath) {
      const stream = createWriteStream(join(process.cwd(), logFilePath), {
        flags: 'a+'
      });

      stream.write(`${msg}\r\n`);
      stream.end();
    }
  };
});

export default Logger;
