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
var Logger = /** @class */ (function () {
    function Logger(options) {
        this.loggerOptions = {
            environment: 'node'
        };
        this.loggerOptions = Object.assign(this.loggerOptions, options);
    }
    return Logger;
}());
['debug', 'info', 'warn', 'error'].forEach(function (level) {
    Logger.prototype[level] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = this.loggerOptions, projectName = _a.projectName, environment = _a.environment, logFilePath = _a.logFilePath, momentFormat = _a.momentFormat;
        var inputArgs = args;
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
        unshiftAppanders.push("[" + level.toUpperCase() + "]");
        inputArgs = unshiftAppanders.concat(args);
        var msg = inputArgs.join(' ');
        console.log(colors[level](msg));
        // console[level].apply(console, inputArgs);
        if (environment === 'node' && logFilePath) {
            console.log(path_1.join(process.cwd(), logFilePath));
            var stream = fs_1.createWriteStream(path_1.join(process.cwd(), logFilePath), {
                flags: 'a+'
            });
            stream.write(msg + "\r");
            stream.end();
        }
    };
});
exports.default = Logger;
