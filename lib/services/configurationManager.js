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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManager = exports.TELEMETRY_CONFIG = exports.DEFAULT_CONFIG_URL = void 0;
const configuration_1 = require("./configuration");
const axios_1 = __importDefault(require("axios"));
const process_1 = require("process");
exports.DEFAULT_CONFIG_URL = 'https://raw.githubusercontent.com/redhat-developer/vscode-redhat-telemetry/main/src/config/telemetry-config.json';
exports.TELEMETRY_CONFIG = "telemetry-config.json";
class ConfigurationManager {
    constructor(extensionId, storageService) {
        this.extensionId = extensionId;
        this.storageService = storageService;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const remoteConfig = yield this.fetchRemoteConfiguration();
            if (remoteConfig) {
                remoteConfig['timestamp'] = new Date().getTime();
                yield this.saveLocalConfiguration(remoteConfig);
            }
            return remoteConfig;
        });
    }
    getExtensionConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            let extensionConfig = this.extensionConfig;
            if (extensionConfig) {
                if (!isStale(yield extensionConfig)) {
                    return extensionConfig;
                }
                this.extensionConfig = undefined;
            }
            console.log("Loading json config for " + this.extensionId);
            this.extensionConfig = this.loadConfiguration(this.extensionId);
            return this.extensionConfig;
        });
    }
    loadConfiguration(extensionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let localConfig;
            try {
                localConfig = yield this.getLocalConfiguration();
                if (isStale(localConfig)) {
                    localConfig = yield this.refresh();
                }
            }
            catch (e) {
                console.error(`Failed to load local configuration: ${e === null || e === void 0 ? void 0 : e.message}`);
            }
            let fullConfig;
            if (localConfig) {
                fullConfig = localConfig;
            }
            else {
                fullConfig = yield this.getEmbeddedConfiguration();
            }
            const json = getExtensionConfig(fullConfig, extensionId);
            return new configuration_1.Configuration(json);
        });
    }
    saveLocalConfiguration(fullConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.storageService.writeToFile(exports.TELEMETRY_CONFIG, JSON.stringify(fullConfig, null, 2));
            }
            catch (e) {
                console.error(`Error saving configuration locally: ${e}`);
            }
            return false;
        });
    }
    fetchRemoteConfiguration(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let telemetryUri = (uri) ? uri : process_1.env[ConfigurationManager.REMOTE_CONFIG_KEY];
            if (!telemetryUri) {
                telemetryUri = exports.DEFAULT_CONFIG_URL;
            }
            console.log(`Updating vscode-redhat-telemetry configuration from ${telemetryUri}`);
            const response = yield axios_1.default.get(telemetryUri);
            try {
                return response === null || response === void 0 ? void 0 : response.data;
            }
            catch (e) {
                console.error(`Failed to parse:\n` + (response === null || response === void 0 ? void 0 : response.data) + '\n' + e);
            }
            return undefined;
        });
    }
    getLocalConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.storageService.readFromFile(exports.TELEMETRY_CONFIG);
            if (content) {
                return JSON.parse(content);
            }
            return undefined;
        });
    }
    getEmbeddedConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const envPath = process_1.env[ConfigurationManager.EMBEDDED_CONFIG_KEY];
            let configPath = (envPath) ? envPath : '../config/' + exports.TELEMETRY_CONFIG;
            return require(configPath);
        });
    }
}
exports.ConfigurationManager = ConfigurationManager;
ConfigurationManager.REMOTE_CONFIG_KEY = 'REDHAT_TELEMETRY_REMOTE_CONFIG_URL';
ConfigurationManager.EMBEDDED_CONFIG_KEY = 'REDHAT_TELEMETRY_EMBEDDED_CONFIG_PATH';
const refreshPattern = /\d+/g;
const REFRESH_PERIOD = 6;
const HOUR_IN_MILLISEC = 60 * 60 * 1000;
function isStale(configOrJson) {
    if (!configOrJson) {
        return true;
    }
    let config;
    if (configOrJson instanceof configuration_1.Configuration) {
        config = configOrJson.json;
    }
    else {
        config = configOrJson;
    }
    const timestamp = config.timestamp ? config.timestamp : 0;
    let period = REFRESH_PERIOD;
    if (config.refresh) {
        const res = config.refresh.match(refreshPattern);
        if (res && res.length) {
            period = parseInt(res[0]);
        }
    }
    let elapsed = new Date().getTime() - timestamp;
    return (elapsed > period * HOUR_IN_MILLISEC);
}
function getExtensionConfig(fullConfig, extensionId) {
    const extensionConfig = Object.assign({}, fullConfig['*'], fullConfig[extensionId]);
    if (fullConfig.timestamp) {
        extensionConfig['timestamp'] = fullConfig.timestamp;
    }
    return extensionConfig;
}
//# sourceMappingURL=configurationManager.js.map