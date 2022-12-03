"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.didUserDisableTelemetry = exports.isPreferenceOverridden = exports.getTelemetryConfiguration = exports.VSCodeSettings = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
class VSCodeSettings {
    isTelemetryEnabled() {
        return this.getTelemetryLevel() !== 'off' && getTelemetryConfiguration().get('enabled', false);
    }
    getTelemetryLevel() {
        //Respecting old vscode telemetry settings https://github.com/microsoft/vscode/blob/f09c4124a229b4149984e1c2da46f35b873d23fa/src/vs/platform/telemetry/common/telemetryUtils.ts#L131
        if (vscode_1.workspace.getConfiguration().get("telemetry.enableTelemetry") == false
            || vscode_1.workspace.getConfiguration().get("telemetry.enableCrashReporter") == false) {
            return "off";
        }
        return vscode_1.workspace.getConfiguration().get("telemetry.telemetryLevel", "off");
    }
    isTelemetryConfigured() {
        return isPreferenceOverridden(constants_1.CONFIG_KEY + '.enabled');
    }
    updateTelemetryEnabledConfig(value) {
        return getTelemetryConfiguration().update('enabled', value, true);
    }
}
exports.VSCodeSettings = VSCodeSettings;
function getTelemetryConfiguration() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_KEY);
}
exports.getTelemetryConfiguration = getTelemetryConfiguration;
function isPreferenceOverridden(section) {
    const config = vscode_1.workspace.getConfiguration().inspect(section);
    return ((config === null || config === void 0 ? void 0 : config.workspaceFolderValue) !== undefined ||
        (config === null || config === void 0 ? void 0 : config.workspaceFolderLanguageValue) !== undefined ||
        (config === null || config === void 0 ? void 0 : config.workspaceValue) !== undefined ||
        (config === null || config === void 0 ? void 0 : config.workspaceLanguageValue) !== undefined ||
        (config === null || config === void 0 ? void 0 : config.globalValue) !== undefined ||
        (config === null || config === void 0 ? void 0 : config.globalLanguageValue) !== undefined);
}
exports.isPreferenceOverridden = isPreferenceOverridden;
function didUserDisableTelemetry() {
    if (vscode_1.env.isTelemetryEnabled) {
        return false;
    }
    //Telemetry is not enabled, but it might not be the user's choice.
    //i.e. could be the App's default setting (VS Codium), or  
    //then the user only asked for reporting errors/crashes, in which case we can do the same. 
    return isPreferenceOverridden("telemetry.telemetryLevel") && vscode_1.workspace.getConfiguration().get("telemetry.telemetryLevel") === "off";
}
exports.didUserDisableTelemetry = didUserDisableTelemetry;
//# sourceMappingURL=settings.js.map