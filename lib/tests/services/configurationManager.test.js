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
const assert_1 = __importDefault(require("assert"));
const axios_1 = __importDefault(require("axios"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const fs = __importStar(require("fs"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const mocha_1 = require("mocha");
const process_1 = require("process");
const configurationManager_1 = require("../../services/configurationManager");
const FileSystemStorageService_1 = require("../../services/FileSystemStorageService");
const path_1 = __importDefault(require("path"));
suite('Test configuration manager', () => {
    let mockAxios;
    let configurationManager;
    const cacheDir = `${process.cwd()}/extension/cache`;
    const storageService = new FileSystemStorageService_1.FileSystemStorageService(cacheDir);
    const remoteConfig = {
        "*": {
            "enabled": "all",
            "refresh": "3h",
            "ratio": "1",
            "includes": [
                {
                    "name": "*"
                }
            ]
        },
        "redhat.vscode-yaml": {
            "enabled": "errors",
            "ratio": "0.5",
            "excludes": [
                {
                    "property": "error",
                    "value": "*stackoverflow*"
                }
            ]
        },
        "redhat.vscode-hypothetical": {
            "enabled": "off"
        }
    };
    (0, mocha_1.beforeEach)(() => {
        (0, mock_fs_1.default)({
            'extension/cache': {}
        });
        configurationManager = new configurationManager_1.ConfigurationManager('redhat.vscode-hypothetical', storageService);
        mockAxios = new axios_mock_adapter_1.default(axios_1.default);
        mockAxios.onGet(configurationManager_1.DEFAULT_CONFIG_URL).replyOnce(200, remoteConfig);
    });
    (0, mocha_1.afterEach)(() => {
        process_1.env[configurationManager_1.ConfigurationManager.EMBEDDED_CONFIG_KEY] = undefined;
        mockAxios.reset();
        mockAxios.restore();
        mock_fs_1.default.restore();
    });
    test('Should download remote config', () => __awaiter(void 0, void 0, void 0, function* () {
        const json = yield configurationManager.fetchRemoteConfiguration();
        assert_1.default.deepStrictEqual(json, remoteConfig);
    }));
    test('Should update stale config', () => __awaiter(void 0, void 0, void 0, function* () {
        const origTimestamp = '12345678';
        mock_fs_1.default.restore();
        (0, mock_fs_1.default)({
            'extension/cache': {
                'telemetry-config.json': '{' +
                    '"*": {' +
                    '"enabled":"errors",' +
                    '"timestamp" : "12345678",' +
                    '"refresh": "12h"' +
                    '}' +
                    '}'
            }
        });
        const config = yield configurationManager.getExtensionConfiguration();
        const referenceTimestamp = config.json.timestamp;
        assert_1.default.notStrictEqual(referenceTimestamp, origTimestamp);
        assert_1.default.strictEqual(config.json.enabled, 'off');
        const configPath = path_1.default.join(cacheDir, configurationManager_1.TELEMETRY_CONFIG);
        const jsonConfig = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }));
        assert_1.default.strictEqual(jsonConfig.timestamp, referenceTimestamp);
    }));
    test('Should store remote content locally', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join(cacheDir, configurationManager_1.TELEMETRY_CONFIG);
        assert_1.default.ok(!fs.existsSync(filePath), `${configurationManager_1.TELEMETRY_CONFIG} should not exist`);
        const config1 = yield configurationManager.getExtensionConfiguration();
        assert_1.default.ok(fs.existsSync(filePath), `${configurationManager_1.TELEMETRY_CONFIG} should exist`);
        const referenceTimestamp = config1.json.timestamp;
        //No http request was made here
        configurationManager = new configurationManager_1.ConfigurationManager('redhat.vscode-other', storageService);
        const config = yield configurationManager.getExtensionConfiguration();
        assert_1.default.strictEqual(config.json.timestamp, referenceTimestamp); //Same timestamp
        delete config.json['timestamp'];
        assert_1.default.deepStrictEqual(config.json, {
            "refresh": "3h",
            "includes": [
                {
                    "name": "*"
                }
            ],
            "enabled": "all",
            "ratio": "1"
        });
    }));
    test('Should inherit config', () => __awaiter(void 0, void 0, void 0, function* () {
        configurationManager = new configurationManager_1.ConfigurationManager('random-vscode', storageService);
        const config = yield configurationManager.getExtensionConfiguration();
        assert_1.default.ok(config.json.timestamp);
        delete config.json['timestamp'];
        assert_1.default.deepStrictEqual(config.json, {
            "enabled": "all",
            "refresh": "3h",
            "ratio": "1",
            "includes": [
                {
                    "name": "*"
                }
            ]
        });
    }));
    test('Should read embedded config', () => __awaiter(void 0, void 0, void 0, function* () {
        mock_fs_1.default.restore();
        process_1.env[configurationManager_1.ConfigurationManager.EMBEDDED_CONFIG_KEY] = '../tests/config/telemetry-config.json';
        mockAxios.reset();
        mockAxios.onGet(configurationManager_1.DEFAULT_CONFIG_URL).reply(404);
        const config = yield configurationManager.getExtensionConfiguration();
        assert_1.default.deepStrictEqual(config.json, {
            "refresh": "2h",
            "includes": [
                {
                    "name": "*"
                }
            ],
            "enabled": "errors",
            "ratio": "0.5",
            "excludes": [
                {
                    "property": "error",
                    "value": "*stackoverflow*"
                }
            ]
        });
    }));
});
//# sourceMappingURL=configurationManager.test.js.map