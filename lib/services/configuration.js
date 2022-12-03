"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const minimatch_1 = __importDefault(require("minimatch"));
const events_1 = require("../utils/events");
const hashcode_1 = require("../utils/hashcode");
class Configuration {
    constructor(json) {
        this.json = json;
    }
    isEnabled() {
        var _a, _b;
        return ((_a = this.json) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || "off" !== ((_b = this.json) === null || _b === void 0 ? void 0 : _b.enabled);
    }
    canSend(event) {
        var _a;
        if (!this.isEnabled()) {
            return false;
        }
        if (["error", "crash"].includes((_a = this.json) === null || _a === void 0 ? void 0 : _a.enabled) && !(0, events_1.isError)(event)) {
            return false;
        }
        const ratio = this.getRatio();
        if (ratio < 1.0) {
            const userNumValue = (0, hashcode_1.numValue)(event.userId);
            if (userNumValue > ratio) {
                return false;
            }
        }
        const isIncluded = this.isIncluded(event) && !this.isExcluded(event);
        return isIncluded;
    }
    isIncluded(event) {
        const includes = this.getIncludePatterns();
        if (includes.length) {
            return isEventMatching(event, includes);
        }
        return true;
    }
    isExcluded(event) {
        const excludes = this.getExcludePatterns();
        if (excludes.length) {
            return isEventMatching(event, excludes);
        }
        return false;
    }
    getIncludePatterns() {
        var _a;
        if ((_a = this.json) === null || _a === void 0 ? void 0 : _a.includes) {
            return this.json.includes;
        }
        return [];
    }
    getExcludePatterns() {
        if (this.json.excludes) {
            return this.json.excludes;
        }
        return [];
    }
    getRatio() {
        if (this.json.ratio) {
            try {
                return parseFloat(this.json.ratio);
            }
            catch (e) {
                // ignore
            }
        }
        return 1.0;
    }
}
exports.Configuration = Configuration;
function isEventMatching(event, patterns) {
    if (!patterns || !patterns.length) {
        return false;
    }
    const match = patterns.find(evtPtn => {
        if (isPropertyPattern(evtPtn)) {
            const props = event.properties;
            if (props) {
                const value = props[evtPtn.property];
                const propertyPattern = evtPtn.value;
                if (value && (0, minimatch_1.default)(value, propertyPattern)) {
                    return true;
                }
            }
        }
        else {
            const eventNamePattern = evtPtn.name;
            if (eventNamePattern && event.event && (0, minimatch_1.default)(event.event, eventNamePattern)) {
                return true;
            }
        }
        return false;
    });
    return !!match;
}
function isPropertyPattern(event) {
    if (event.property) {
        return true;
    }
    return false;
}
//# sourceMappingURL=configuration.js.map