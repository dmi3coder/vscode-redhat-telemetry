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
exports.TelemetryServiceImpl = void 0;
const logger_1 = require("../utils/logger");
const events_1 = require("../utils/events");
/**
 * Implementation of a `TelemetryService`
 */
class TelemetryServiceImpl {
    constructor(reporter, queue, settings, idManager, environment, configurationManager) {
        this.reporter = reporter;
        this.queue = queue;
        this.settings = settings;
        this.idManager = idManager;
        this.environment = environment;
        this.configurationManager = configurationManager;
        this.startTime = this.getCurrentTimeInSeconds();
    }
    /*
      Collects telemetry data and pushes to a queue when not opted in
      and to segment when user has opted for telemetry
    */
    send(event) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log(`Event received: ${event.name}`);
            if (this.settings.isTelemetryEnabled()) {
                // flush whatever was in the queue, however it's unlikely there's anything left at this point.
                this.flushQueue();
                this.sendEvent(event);
            }
            else if (!this.settings.isTelemetryConfigured()) {
                // Still waiting for opt-in?, then queue events
                (_a = this.queue) === null || _a === void 0 ? void 0 : _a.addEvent(event);
            }
        });
    }
    sendStartupEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.startTime = this.getCurrentTimeInSeconds();
            return this.send({ name: 'startup' });
        });
    }
    sendShutdownEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send({ name: 'shutdown', properties: {
                    //Sends session duration in seconds
                    session_duration: this.getCurrentTimeInSeconds() - this.startTime
                } });
        });
    }
    sendEvent(event) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //Check against VS Code settings
            const level = this.settings.getTelemetryLevel();
            if (level && ["error", "crash"].includes(level) && !(0, events_1.isError)(event)) {
                return;
            }
            event = (0, events_1.enhance)(event, this.environment);
            let payload = {
                userId: yield this.idManager.getRedHatUUID(),
                event: event.name,
                properties: event.properties,
                measures: event.measures,
                traits: event.traits,
                context: event.context
            };
            //Check against Extension configuration
            const config = yield ((_a = this.configurationManager) === null || _a === void 0 ? void 0 : _a.getExtensionConfiguration());
            if (!config || config.canSend(payload)) {
                return this.reporter.report(payload, event.type);
            }
        });
    }
    flushQueue() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const eventsToFlush = (_a = this.queue) === null || _a === void 0 ? void 0 : _a.events;
            if (eventsToFlush && this.settings.isTelemetryEnabled()) {
                while (eventsToFlush.length > 0) {
                    const event = (_c = (_b = this.queue) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.shift();
                    if (event) {
                        this.sendEvent(event);
                    }
                }
            }
            // No matter what, we need to empty the queue if it exists
            (_d = this.queue) === null || _d === void 0 ? void 0 : _d.emptyQueue();
        });
    }
    dispose() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.queue) === null || _a === void 0 ? void 0 : _a.emptyQueue();
            return this.reporter.flush();
        });
    }
    getCurrentTimeInSeconds() {
        const now = Date.now();
        return Math.floor(now / 1000);
    }
}
exports.TelemetryServiceImpl = TelemetryServiceImpl;
//# sourceMappingURL=telemetryServiceImpl.js.map