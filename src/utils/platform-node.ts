import * as os from 'os';
import osLocale from 'os-locale';
import getos from 'getos';
import { LinuxOs } from 'getos';
import { Environment } from '..';
import { env, UIKind, version} from 'vscode';
import { promisify } from 'util';
import process from 'process';
import { getCountry } from './geolocation';

export const PLATFORM = getPlatform();
export const DISTRO = getDistribution();
export const PLATFORM_VERSION = os.release();
export const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const LOCALE = osLocale.sync().replace('_', '-');
export const COUNTRY = getCountry(TIMEZONE);
export const UI_KIND = getUIKind();
export const USERNAME = getUsername();


function getPlatform(): string {
    const platform: string = os.platform();
    if (platform.startsWith('win')) {
        return 'Windows';
    }
    if (platform.startsWith('darwin')) {
        return 'Mac';
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1);
}
async function getDistribution(): Promise<string|undefined> {
    if (os.platform() === 'linux') {
      const platorm = await promisify(getos)() as LinuxOs;
      return platorm.dist;
    }
    return undefined;
}

export async function getEnvironment(extensionId: string, extensionVersion:string): Promise<Environment> {
    return {
        extension: {
            name:extensionId,
            version:extensionVersion,
        },
        application: {
            name: env.appName,
            version: version,
            uiKind: UI_KIND,
            remote: env.remoteName !== undefined
        },
        platform:{
            name:PLATFORM,
            version:PLATFORM_VERSION,
            distribution: await DISTRO
        },
        timezone:TIMEZONE,
        locale:LOCALE,
        country: COUNTRY,
        username: USERNAME
    };
}
function getUIKind():string {
    switch (env.uiKind) {
        case UIKind.Desktop:
            return 'Desktop';
        case UIKind.Web:
            return 'Web';
        default:
            return 'Unknown';
    }
}

function getUsername(): string | undefined {
    const pEnv = process.env;

    let username = (
        pEnv.SUDO_USER ||
        pEnv.C9_USER /* Cloud9 */ ||
        pEnv.LOGNAME ||
        pEnv.USER ||
        pEnv.LNAME ||
        pEnv.USERNAME
    );
    if (!username) {
        try {
            username = os.userInfo().username;
        } catch (_) {}
    }
    return username;
}
