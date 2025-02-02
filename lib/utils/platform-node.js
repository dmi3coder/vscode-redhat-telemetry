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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironment = exports.USERNAME = exports.UI_KIND = exports.COUNTRY = exports.LOCALE = exports.TIMEZONE = exports.PLATFORM_VERSION = exports.DISTRO = exports.PLATFORM = void 0;
const os = __importStar(require("os"));
const os_locale_1 = __importDefault(require("os-locale"));
const getos_1 = __importDefault(require("getos"));
const vscode_1 = require("vscode");
const util_1 = require("util");
const process_1 = __importDefault(require("process"));
const geolocation_1 = require("./geolocation");
exports.PLATFORM = getPlatform();
exports.DISTRO = getDistribution();
exports.PLATFORM_VERSION = os.release();
exports.TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
exports.LOCALE = os_locale_1.default.sync().replace('_', '-');
exports.COUNTRY = (0, geolocation_1.getCountry)(exports.TIMEZONE);
exports.UI_KIND = getUIKind();
exports.USERNAME = getUsername();
function getPlatform() {
    const platform = os.platform();
    if (platform.startsWith('win')) {
        return 'Windows';
    }
    if (platform.startsWith('darwin')) {
        return 'Mac';
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1);
}
function getDistribution() {
    return __awaiter(this, void 0, void 0, function* () {
        if (os.platform() === 'linux') {
            const platorm = yield (0, util_1.promisify)(getos_1.default)();
            return platorm.dist;
        }
        return undefined;
    });
}
function getEnvironment(extensionId, extensionVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            extension: {
                name: extensionId,
                version: extensionVersion,
            },
            application: {
                name: vscode_1.env.appName,
                version: vscode_1.version,
                uiKind: exports.UI_KIND,
                remote: vscode_1.env.remoteName !== undefined
            },
            platform: {
                name: exports.PLATFORM,
                version: exports.PLATFORM_VERSION,
                distribution: yield exports.DISTRO
            },
            timezone: exports.TIMEZONE,
            locale: exports.LOCALE,
            country: exports.COUNTRY,
            username: exports.USERNAME
        };
    });
}
exports.getEnvironment = getEnvironment;
function getUIKind() {
    switch (vscode_1.env.uiKind) {
        case vscode_1.UIKind.Desktop:
            return 'Desktop';
        case vscode_1.UIKind.Web:
            return 'Web';
        default:
            return 'Unknown';
    }
}
function getUsername() {
    const pEnv = process_1.default.env;
    let username = (pEnv.SUDO_USER ||
        pEnv.C9_USER /* Cloud9 */ ||
        pEnv.LOGNAME ||
        pEnv.USER ||
        pEnv.LNAME ||
        pEnv.USERNAME);
    if (!username) {
        try {
            username = os.userInfo().username;
        }
        catch (_) { }
    }
    return username;
}
//# sourceMappingURL=platform-node.js.map