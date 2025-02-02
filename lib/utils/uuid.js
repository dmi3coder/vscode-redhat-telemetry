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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const logger_1 = require("./logger");
let REDHAT_ANONYMOUS_UUID;
const REDHAT_NAMESPACE_UUID = '44662bc6-c388-4e0e-a652-53bda6f35923';
var UUID;
(function (UUID) {
    function getRedHatUUID(redhatDir) {
        if (REDHAT_ANONYMOUS_UUID) {
            return REDHAT_ANONYMOUS_UUID;
        }
        const redhatUUIDFilePath = getAnonymousIdFile(redhatDir);
        try {
            REDHAT_ANONYMOUS_UUID = readFile(redhatUUIDFilePath);
            if (REDHAT_ANONYMOUS_UUID) {
                logger_1.Logger.log(`loaded Red Hat UUID: ${REDHAT_ANONYMOUS_UUID}`);
            }
            else {
                logger_1.Logger.log('No Red Hat UUID found');
                REDHAT_ANONYMOUS_UUID = (0, uuid_1.v4)();
                writeFile(redhatUUIDFilePath, REDHAT_ANONYMOUS_UUID);
                logger_1.Logger.log(`Written Red Hat UUID: ${REDHAT_ANONYMOUS_UUID} to ${redhatUUIDFilePath}`);
            }
        }
        catch (e) {
            logger_1.Logger.log('Failed to access Red Hat UUID: ' + (e === null || e === void 0 ? void 0 : e.message));
        }
        return REDHAT_ANONYMOUS_UUID;
    }
    UUID.getRedHatUUID = getRedHatUUID;
    function getAnonymousIdFile(redhatDir) {
        const homedir = os.homedir();
        if (!redhatDir) {
            redhatDir = path.join(homedir, '.redhat');
        }
        return path.join(redhatDir, 'anonymousId');
    }
    UUID.getAnonymousIdFile = getAnonymousIdFile;
    function readFile(filePath) {
        let content;
        if (fs.existsSync(filePath)) {
            content = fs.readFileSync(filePath, { encoding: 'utf8' });
            if (content) {
                content = content.trim();
            }
        }
        return content;
    }
    UUID.readFile = readFile;
    function writeFile(filePath, content) {
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }
    UUID.writeFile = writeFile;
    function generateUUID(source) {
        return (0, uuid_1.v5)(source, REDHAT_NAMESPACE_UUID);
    }
    UUID.generateUUID = generateUUID;
})(UUID = exports.UUID || (exports.UUID = {}));
//# sourceMappingURL=uuid.js.map