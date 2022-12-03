"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const object_hash_1 = require("object-hash");
const logger_1 = require("../utils/logger");
/**
 * Sends Telemetry events to a segment.io backend
 */
class Reporter {
    constructor(analytics, cacheService) {
        this.analytics = analytics;
        this.cacheService = cacheService;
    }
    report(event, type = 'track') {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.analytics) {
                return;
            }
            const payloadString = JSON.stringify(event);
            switch (type) {
                case 'identify':
                    //Avoid identifying the user several times, until some data has changed.
                    const hash = (0, object_hash_1.sha1)(payloadString);
                    const cached = yield ((_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.get('identify'));
                    if (hash === cached) {
                        logger_1.Logger.log(`Skipping 'identify' event! Already sent:\n${payloadString}`);
                        return;
                    }
                    logger_1.Logger.log(`Sending 'identify' event with\n${payloadString}`);
                    (_b = this.analytics) === null || _b === void 0 ? void 0 : _b.identify(event);
                    (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.put('identify', hash);
                    break;
                case 'track':
                    logger_1.Logger.log(`Sending 'track' event with\n${payloadString}`);
                    (_d = this.analytics) === null || _d === void 0 ? void 0 : _d.track(event);
                    break;
                case 'page':
                    logger_1.Logger.log(`Sending 'page' event with\n${payloadString}`);
                    (_e = this.analytics) === null || _e === void 0 ? void 0 : _e.page(event);
                    break;
                default:
                    logger_1.Logger.log(`Skipping unsupported (yet?) '${type}' event with\n${payloadString}`);
                    break;
            }
        });
    }
    flush() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.analytics) === null || _a === void 0 ? void 0 : _a.flush();
        });
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=reporter.js.map