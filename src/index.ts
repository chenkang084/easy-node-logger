import { writeFileSync } from 'fs';
import { join } from 'path';
import moment = require('moment');

type logMethodLevel = 'debug' | 'info' | 'warn' | 'error';
interface LoggerOptions {
  projectName?: string;
  momentFormat?: string;
  environment?: 'browser' | 'node';
  logFilePath?: string;
}

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
      unshiftAppanders.push(`${projectName}:`);
    }

    if (momentFormat) {
      time = moment().format(momentFormat);
    }
    unshiftAppanders.push(time);

    inputArgs = unshiftAppanders.concat(args);

    console[level].apply(console, inputArgs);

    if (environment === 'node' && logFilePath) {
      writeFileSync(join(__dirname, logFilePath), `${inputArgs.join(' ')}\r`, {
        flag: 'a'
      });
    }
  };
});

export default Logger;
