import { Reporter } from './reporter';
import { TelemetrySettings } from '../interfaces/settings';
import { TelemetryEventQueue } from '../utils/telemetryEventQueue';
import { TelemetryService, TelemetryEvent } from '../interfaces/telemetry';
import { ConfigurationManager } from './configurationManager';
import { IdManager } from '../interfaces/idManager';
import { Environment } from '../interfaces/environment';
/**
 * Implementation of a `TelemetryService`
 */
export declare class TelemetryServiceImpl implements TelemetryService {
    private reporter;
    private queue;
    private settings;
    private idManager;
    private environment;
    private configurationManager?;
    private startTime;
    constructor(reporter: Reporter, queue: TelemetryEventQueue | undefined, settings: TelemetrySettings, idManager: IdManager, environment: Environment, configurationManager?: ConfigurationManager | undefined);
    send(event: TelemetryEvent): Promise<void>;
    sendStartupEvent(): Promise<void>;
    sendShutdownEvent(): Promise<void>;
    private sendEvent;
    flushQueue(): Promise<void>;
    dispose(): Promise<void>;
    private getCurrentTimeInSeconds;
}
//# sourceMappingURL=telemetryServiceImpl.d.ts.map