import { WorkspaceConfiguration } from 'vscode';
import { TelemetrySettings } from '../interfaces/settings';
export declare class VSCodeSettings implements TelemetrySettings {
    isTelemetryEnabled(): boolean;
    getTelemetryLevel(): string;
    isTelemetryConfigured(): boolean;
    updateTelemetryEnabledConfig(value: boolean): Thenable<void>;
}
export declare function getTelemetryConfiguration(): WorkspaceConfiguration;
export declare function isPreferenceOverridden(section: string): boolean;
export declare function didUserDisableTelemetry(): boolean;
//# sourceMappingURL=settings.d.ts.map