import Analytics from 'analytics-node';
import { CacheService } from '../interfaces/cacheService';
import { AnalyticsEvent } from './AnalyticsEvent';
/**
 * Sends Telemetry events to a segment.io backend
 */
export declare class Reporter {
    private analytics?;
    private cacheService?;
    constructor(analytics?: Analytics | undefined, cacheService?: CacheService | undefined);
    report(event: AnalyticsEvent, type?: string): Promise<void>;
    flush(): Promise<void>;
}
//# sourceMappingURL=reporter.d.ts.map