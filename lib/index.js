"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var moment = require("moment");
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
            unshiftAppanders.push(projectName + ":");
        }
        if (momentFormat) {
            time = moment().format(momentFormat);
        }
        unshiftAppanders.push(time);
        inputArgs = unshiftAppanders.concat(args);
        console[level].apply(console, inputArgs);
        if (environment === 'node' && logFilePath) {
            fs_1.writeFileSync(logFilePath, time + " " + inputArgs.join(' ') + "\r", {
                flag: 'a'
            });
        }
    };
});
// const logger = new Logger({
//   projectName: 'easy-node-logger',
//   logFilePath: './test.log',
//   environment: 'node'
// });
// for (let i = 0; i < 1000; i++) {
//   logger.info('test info method');
// }
exports.default = Logger;
