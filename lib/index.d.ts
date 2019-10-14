interface LoggerOptions {
    projectName?: string;
    momentFormat?: string;
    environment?: 'browser' | 'node';
    logFilePath?: string;
}
declare class Logger {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    loggerOptions: LoggerOptions;
    constructor(options: LoggerOptions);
}
export default Logger;
