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
const mock_fs_1 = __importDefault(require("mock-fs"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const assert = __importStar(require("assert"));
const fileSystemCacheService_1 = require("../../services/fileSystemCacheService");
let cacheService;
const cacheDir = `${process.cwd()}/extension/cache`;
suite('Test cache service', () => {
    setup(() => {
        (0, mock_fs_1.default)({
            'extension/cache': {
                'identity.txt': 'hash'
            }
        });
        cacheService = new fileSystemCacheService_1.FileSystemCacheService(cacheDir);
    });
    teardown(() => {
        mock_fs_1.default.restore();
    });
    test('Should create cache directory recursively', () => __awaiter(void 0, void 0, void 0, function* () {
        const cacheDir = `${process.cwd()}/extensions/cache/` + new Date().getTime();
        cacheService = new fileSystemCacheService_1.FileSystemCacheService(cacheDir);
        const filePath = path_1.default.join(cacheDir, 'something.txt');
        yield cacheService.put('something', 'hash');
        assert.ok(fs.existsSync(filePath), 'something.txt should exist');
    }));
    test('Should read data from FS', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield cacheService.get('identity');
        assert.strictEqual(data, 'hash');
        const filePath = path_1.default.join(cacheDir, 'identity.txt');
        // Delete underlying file and check data is read from memory from now on
        fs.unlinkSync(filePath);
        data = yield cacheService.get('identity');
        assert.strictEqual(data, 'hash');
        assert.ok(!fs.existsSync(filePath), 'identity.txt should not exist');
    }));
    test('Should write data to FS', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join(cacheDir, 'something.txt');
        assert.ok(!fs.existsSync(filePath), 'something.txt should not exist');
        yield cacheService.put('something', 'hash');
        assert.ok(fs.existsSync(filePath), 'something.txt should exist');
    }));
});
//# sourceMappingURL=fileSystemCacheService.test.js.map