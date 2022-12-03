"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numValue = exports.hashCode = void 0;
//See https://stackoverflow.com/a/8076436/753170
function hashCode(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
exports.hashCode = hashCode;
const cache = new Map();
function numValue(value) {
    let num = cache.get(value);
    if (num) {
        return num;
    }
    const hash = Math.abs(hashCode(value)).toString();
    const x = Math.min(2, hash.length);
    num = parseFloat(hash.substring(hash.length - x)) / 100;
    cache.set(value, num);
    return num;
}
exports.numValue = numValue;
//# sourceMappingURL=hashcode.js.map