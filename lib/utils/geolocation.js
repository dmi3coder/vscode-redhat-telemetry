"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountry = void 0;
const countries_and_timezones_1 = require("countries-and-timezones");
function getCountry(timezone) {
    const tz = (0, countries_and_timezones_1.getTimezone)(timezone);
    if (tz && (tz === null || tz === void 0 ? void 0 : tz.country)) {
        return tz.country;
    }
    //Probably UTC timezone
    return 'ZZ'; //Unknown country
}
exports.getCountry = getCountry;
//# sourceMappingURL=geolocation.js.map