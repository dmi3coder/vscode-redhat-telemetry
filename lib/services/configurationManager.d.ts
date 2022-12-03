import { Configuration } from "./configuration";
import { FileSystemStorageService } from "./FileSystemStorageService";
export declare const DEFAULT_CONFIG_URL = "https://raw.githubusercontent.com/redhat-developer/vscode-redhat-telemetry/main/src/config/telemetry-config.json";
export declare const TELEMETRY_CONFIG = "telemetry-config.json";
export declare class ConfigurationManager {
    private extensionId;
    private storageService;
    static REMOTE_CONFIG_KEY: string;
    static EMBEDDED_CONFIG_KEY: string;
    constructor(extensionId: string, storageService: FileSystemStorageService);
    private extensionConfig;
    refresh(): Promise<void>;
    getExtensionConfiguration(): Promise<Configuration>;
    private loadConfiguration;
    saveLocalConfiguration(fullConfig: any): Promise<boolean>;
    fetchRemoteConfiguration(uri?: string): Promise<any>;
    getLocalConfiguration(): Promise<any | undefined>;
    getEmbeddedConfiguration(): Promise<any>;
}
//# sourceMappingURL=configurationManager.d.ts.map