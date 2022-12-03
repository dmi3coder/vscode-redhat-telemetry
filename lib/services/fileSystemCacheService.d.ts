import { CacheService } from "../interfaces/cacheService";
import { FileSystemStorageService } from "./FileSystemStorageService";
export declare class FileSystemCacheService extends FileSystemStorageService implements CacheService {
    private memCache;
    constructor(storagePath: string);
    get(key: string): Promise<string | undefined>;
    put(key: string, value: string): Promise<boolean>;
}
//# sourceMappingURL=fileSystemCacheService.d.ts.map