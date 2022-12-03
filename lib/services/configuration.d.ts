import { AnalyticsEvent } from "./AnalyticsEvent";
interface EventNamePattern {
    name: string;
}
interface PropertyPattern {
    property: string;
    value: string;
}
declare type EventPattern = EventNamePattern | PropertyPattern;
export declare class Configuration {
    json: any;
    constructor(json: any);
    isEnabled(): boolean;
    canSend(event: AnalyticsEvent): boolean;
    isIncluded(event: AnalyticsEvent): boolean;
    isExcluded(event: AnalyticsEvent): boolean;
    getIncludePatterns(): EventPattern[];
    getExcludePatterns(): EventPattern[];
    getRatio(): number;
}
export {};
//# sourceMappingURL=configuration.d.ts.map