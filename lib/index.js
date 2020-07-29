"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var moment = require("moment");
var chalk = require('chalk');
var cluster = require('cluster');
var colors = {
    debug: chalk.green,
    info: chalk.green,
    warn: chalk.keyword('orange'),
    error: chalk.red
};
var levelNumber = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
var Logger = /** @class */ (function () {
    function Logger(options) {
        this.loggerOptions = {
            environment: 'node',
            level: 'info',
            momentFormat: 'YYYY-MM-DD HH:mm:ss'
        };
        this.loggerOptions = Object.assign(this.loggerOptions, options);
    }
    return Logger;
}());
['debug', 'info', 'warn', 'error'].forEach(function (type, index) {
    Logger.prototype[type] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = this.loggerOptions, projectName = _a.projectName, environment = _a.environment, logFileFolder = _a.logFileFolder, momentFormat = _a.momentFormat, level = _a.level;
        if (index >= levelNumber[level]) {
            // format the input args as a string
            var inputArgs = JSON.stringify(args);
            var time = new Date().toString();
            var unshiftAppanders = [];
            if (projectName) {
                unshiftAppanders.push("" + projectName);
            }
            if (cluster.isWorker) {
                unshiftAppanders.push("workerID:" + cluster.worker.id);
            }
            if (momentFormat) {
                time = moment().format(momentFormat);
            }
            unshiftAppanders.push(time);
            unshiftAppanders.push("[" + type.toUpperCase() + "]");
            // remove [] from stringify
            inputArgs = inputArgs.substr(1, inputArgs.length - 2);
            unshiftAppanders.push(inputArgs);
            var msg = unshiftAppanders.join(' ');
            console.log(colors[type](msg));
            // write file
            if (environment === 'node' && logFileFolder) {
                var logFolder = path_1.join(process.cwd(), logFileFolder);
                if (!fs_1.existsSync(logFolder)) {
                    fs_1.mkdirSync(logFolder);
                }
                var fileName = moment().format('YYYYMMDD_HH') + '.log';
                var logFilePath = path_1.join(process.cwd(), logFileFolder, fileName);
                // create or update file
                var stream = fs_1.createWriteStream(logFilePath, {
                    flags: 'a+'
                });
                stream.write(msg + "\r\n");
                stream.end();
            }
        }
    };
});
exports.default = Logger;
