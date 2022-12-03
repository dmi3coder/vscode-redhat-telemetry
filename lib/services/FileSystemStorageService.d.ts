export declare class FileSystemStorageService {
    private storagePath;
    constructor(storagePath: string);
    readFromFile(fileName: string): Promise<string | undefined>;
    writeToFile(filename: string, content: string): Promise<boolean>;
}
//# sourceMappingURL=FileSystemStorageService.d.ts.map