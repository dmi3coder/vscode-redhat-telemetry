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
exports.FileSystemCacheService = void 0;
const FileSystemStorageService_1 = require("./FileSystemStorageService");
class FileSystemCacheService extends FileSystemStorageService_1.FileSystemStorageService {
    constructor(storagePath) {
        super(storagePath);
        this.memCache = new Map();
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.memCache.has(key)) {
                return Promise.resolve(this.memCache.get(key));
            }
            const value = yield this.readFromFile(`${key}.txt`);
            if (value) {
                this.memCache.set(key, value);
            }
            return value;
        });
    }
    put(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.memCache.set(key, value);
            yield this.writeToFile(`${key}.txt`, value);
            return true;
        });
    }
}
exports.FileSystemCacheService = FileSystemCacheService;
//# sourceMappingURL=fileSystemCacheService.js.map