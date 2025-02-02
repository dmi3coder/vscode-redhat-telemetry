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
exports.TelemetryServiceBuilder = void 0;
const reporter_1 = require("./reporter");
const telemetryServiceImpl_1 = require("./telemetryServiceImpl");
const telemetryEventQueue_1 = require("../utils/telemetryEventQueue");
const segmentInitializer_1 = require("../utils/segmentInitializer");
const fileSystemIdManager_1 = require("./fileSystemIdManager");
const extensions_1 = require("../utils/extensions");
/**
 * `TelemetryService` builder
 */
class TelemetryServiceBuilder {
    constructor(packageJson) {
        this.packageJson = packageJson;
    }
    setPackageJson(packageJson) {
        this.packageJson = packageJson;
        return this;
    }
    setSettings(settings) {
        this.settings = settings;
        return this;
    }
    setIdManager(idManager) {
        this.idManager = idManager;
        return this;
    }
    setEnvironment(environment) {
        this.environment = environment;
        return this;
    }
    setConfigurationManager(configManager) {
        this.configurationManager = configManager;
        return this;
    }
    setCacheService(cacheService) {
        this.cacheService = cacheService;
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.validate();
            const analytics = segmentInitializer_1.SegmentInitializer.initialize(this.packageJson);
            if (!this.idManager) {
                this.idManager = new fileSystemIdManager_1.FileSystemIdManager();
            }
            if (!this.environment) {
                this.environment = {
                    extension: {
                        name: (0, extensions_1.getExtensionId)(this.packageJson),
                        version: this.packageJson.version
                    },
                    application: {
                        name: 'Unknown',
                        version: '-'
                    },
                    platform: {
                        name: 'Unknown',
                        version: '-'
                    }
                };
            }
            const reporter = new reporter_1.Reporter(analytics, this.cacheService);
            const queue = this.settings.isTelemetryConfigured()
                ? undefined
                : new telemetryEventQueue_1.TelemetryEventQueue();
            return new telemetryServiceImpl_1.TelemetryServiceImpl(reporter, queue, this.settings, this.idManager, this.environment, this.configurationManager);
        });
    }
    validate() {
        if (!this.packageJson) {
            throw new Error('packageJson is not set');
        }
        if (!this.environment) {
            throw new Error('Environment is not set');
        }
    }
}
exports.TelemetryServiceBuilder = TelemetryServiceBuilder;
//# sourceMappingURL=telemetryServiceBuilder.js.map