"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.doLog = void 0;
exports.doLog = (typeof process !== 'undefined') ? process.env.VSCODE_REDHAT_TELEMETRY_DEBUG === 'true' : false;
// This exists only for testing purposes. Could delete later.
const VERSION = require('../../package.json').version;
var Logger;
(function (Logger) {
    Logger.extId = 'unknown';
    function log(s) {
        if (exports.doLog) {
            console.log(`vscode-redhat-telemetry ${VERSION} (${Logger.extId}): ${s}`);
        }
    }
    Logger.log = log;
})(Logger = exports.Logger || (exports.Logger = {}));
//# sourceMappingURL=logger.js.map