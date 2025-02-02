"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getRedHatService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const __1 = require("..");
const configurationManager_1 = require("../services/configurationManager");
const fileSystemCacheService_1 = require("../services/fileSystemCacheService");
const idManagerFactory_1 = require("../services/idManagerFactory");
const extensions_1 = require("../utils/extensions");
const logger_1 = require("../utils/logger");
const platform_node_1 = require("../utils/platform-node");
const constants_1 = require("./constants");
const settings_1 = require("./settings");
const RETRY_OPTIN_DELAY_IN_MS = 24 * 60 * 60 * 1000; // 24h
/**
 * Returns a new `RedHatService` instance for a Visual Studio Code extension. For telemetry, the following is performed:
 * - A preference listener enables/disables  telemetry based on changes to `redhat.telemetry.enabled`
 * - If `redhat.telemetry.enabled` is not set, a popup requesting telemetry opt-in will be displayed
 * - when the extension is deactivated, a telemetry shutdown event will be emitted (if telemetry is enabled)
 *
 * @param context the extension's context
 * @returns a Promise of RedHatService
 */
function getRedHatService(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionInfo = getExtension(context);
        const extensionId = extensionInfo.id;
        logger_1.Logger.extId = extensionId;
        const packageJson = getPackageJson(extensionInfo);
        const settings = new settings_1.VSCodeSettings();
        const idManager = idManagerFactory_1.IdManagerFactory.getIdManager();
        const cachePath = path.resolve(getTelemetryWorkingDir(context), 'cache');
        const cacheService = new fileSystemCacheService_1.FileSystemCacheService(cachePath);
        const builder = new __1.TelemetryServiceBuilder(packageJson)
            .setSettings(settings)
            .setIdManager(idManager)
            .setCacheService(cacheService)
            .setConfigurationManager(new configurationManager_1.ConfigurationManager(extensionId, cacheService))
            .setEnvironment(yield (0, platform_node_1.getEnvironment)(extensionId, packageJson.version));
        const telemetryService = yield builder.build();
        // register disposable to send shutdown event
        context.subscriptions.push(shutdownHook(telemetryService));
        // register preference listener for that extension, 
        // so it stops/starts sending data when redhat.telemetry.enabled changes
        context.subscriptions.push(onDidChangeTelemetryEnabled(telemetryService));
        openTelemetryOptInDialogIfNeeded(context, extensionId, settings);
        telemetryService.send({
            type: 'identify',
            name: 'identify'
        });
        return {
            getTelemetryService: () => Promise.resolve(telemetryService),
            getIdManager: () => Promise.resolve(idManager)
        };
    });
}
exports.getRedHatService = getRedHatService;
function onDidChangeTelemetryEnabled(telemetryService) {
    return vscode_1.workspace.onDidChangeConfiguration(
    //as soon as user changed the redhat.telemetry setting, we consider
    //opt-in (or out) has been set, so whichever the choice is, we flush the queue
    (e) => {
        if (e.affectsConfiguration("redhat.telemetry") || e.affectsConfiguration("telemetry")) {
            telemetryService.flushQueue();
        }
    });
}
function openTelemetryOptInDialogIfNeeded(context, extensionId, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settings.isTelemetryConfigured() || (0, settings_1.didUserDisableTelemetry)()) {
            return;
        }
        let popupInfo;
        const parentDir = getTelemetryWorkingDir(context);
        const optinPopupInfo = path.resolve(parentDir, 'redhat.optin.json');
        if (fs.existsSync(optinPopupInfo)) {
            const rawdata = fs.readFileSync(optinPopupInfo, { encoding: 'utf8' });
            popupInfo = JSON.parse(rawdata);
        }
        if (popupInfo) {
            if (popupInfo.sessionId !== vscode_1.env.sessionId || popupInfo.owner !== extensionId) {
                //someone else is showing the popup, bail.
                return;
            }
        }
        else {
            popupInfo = {
                owner: extensionId,
                sessionId: vscode_1.env.sessionId,
                time: new Date().getTime() //for troubleshooting purposes
            };
            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, { recursive: true });
            }
            fs.writeFileSync(optinPopupInfo, JSON.stringify(popupInfo));
            context.subscriptions.push({
                dispose: () => { safeCleanup(optinPopupInfo); }
            });
        }
        const message = `Help us improve its extensions by allowing them to collect usage data. 
    Read our [privacy statement](${constants_1.PRIVACY_STATEMENT_URL}?from=${extensionId}) 
  and learn how to [opt out](${constants_1.OPT_OUT_INSTRUCTIONS_URL}?from=${extensionId}).`;
        const retryOptin = setTimeout(openTelemetryOptInDialogIfNeeded, RETRY_OPTIN_DELAY_IN_MS, context, settings);
        let selection;
        try {
            selection = yield vscode_1.window.showInformationMessage(message, 'Accept', 'Deny');
            if (!selection) {
                //close was chosen. Ask next time.
                return;
            }
            clearTimeout(retryOptin);
            settings.updateTelemetryEnabledConfig(selection === 'Accept');
        }
        finally {
            if (selection) {
                safeCleanup(optinPopupInfo);
            }
        }
    });
}
function getExtension(context) {
    if (context.extension) {
        return context.extension;
    }
    //When running in older vscode versions:
    const packageJson = (0, extensions_1.loadPackageJson)(context.extensionPath);
    const info = {
        id: (0, extensions_1.getExtensionId)(packageJson),
        packageJSON: packageJson
    };
    return info;
}
function getPackageJson(extension) {
    const packageJson = extension.packageJSON;
    if (!packageJson.segmentWriteKey) {
        packageJson.segmentWriteKey = constants_1.DEFAULT_SEGMENT_KEY;
    }
    if (!packageJson.segmentWriteKeyDebug) {
        packageJson.segmentWriteKeyDebug = constants_1.DEFAULT_SEGMENT_DEBUG_KEY;
    }
    return packageJson;
}
function safeCleanup(filePath) {
    try {
        fs.unlinkSync(filePath);
    }
    catch (err) {
        logger_1.Logger.log(err);
    }
    logger_1.Logger.log(`Deleted ${filePath}`);
}
function shutdownHook(telemetryService) {
    return {
        dispose: () => __awaiter(this, void 0, void 0, function* () {
            yield telemetryService.sendShutdownEvent();
            yield telemetryService.dispose();
        })
    };
}
function getTelemetryWorkingDir(context) {
    return path.resolve(context.globalStorageUri.fsPath, '..', 'vscode-redhat-telemetry');
}
//# sourceMappingURL=redhatService.js.map