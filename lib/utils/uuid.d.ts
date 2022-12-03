export declare namespace UUID {
    function getRedHatUUID(redhatDir?: string): string;
    function getAnonymousIdFile(redhatDir?: string): string;
    function readFile(filePath: string): string | undefined;
    function writeFile(filePath: string, content: string): void;
    function generateUUID(source: string): string;
}
//# sourceMappingURL=uuid.d.ts.map