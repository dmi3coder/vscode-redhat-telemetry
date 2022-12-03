import { Environment } from '../interfaces/environment';
import { IdManager } from '../interfaces/idManager';
import { TelemetryService } from '../interfaces/telemetry';
import { TelemetrySettings } from '../interfaces/settings';
import { CacheService } from '../interfaces/cacheService';
import { ConfigurationManager } from './configurationManager';
/**
 * `TelemetryService` builder
 */
export declare class TelemetryServiceBuilder {
    private packageJson;
    private settings?;
    private idManager?;
    private environment?;
    private cacheService?;
    private configurationManager?;
    constructor(packageJson?: any);
    setPackageJson(packageJson: any): TelemetryServiceBuilder;
    setSettings(settings: TelemetrySettings): TelemetryServiceBuilder;
    setIdManager(idManager: IdManager): TelemetryServiceBuilder;
    setEnvironment(environment: Environment): TelemetryServiceBuilder;
    setConfigurationManager(configManager: ConfigurationManager): TelemetryServiceBuilder;
    setCacheService(cacheService: CacheService): TelemetryServiceBuilder;
    build(): Promise<TelemetryService>;
    private validate;
}
//# sourceMappingURL=telemetryServiceBuilder.d.ts.map