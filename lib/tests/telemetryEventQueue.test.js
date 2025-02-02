"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const telemetryEventQueue_1 = require("../utils/telemetryEventQueue");
const assert = __importStar(require("assert"));
let dummyEvent = { name: "test" };
suite("Event Queue Test Suite", () => {
    let queue = new telemetryEventQueue_1.TelemetryEventQueue();
    test("should generate event queue", () => {
        assert.strictEqual(typeof queue.events, typeof []);
    });
    test("should push element in event queue", () => {
        var _a;
        queue.addEvent(dummyEvent);
        assert.strictEqual((_a = queue.events) === null || _a === void 0 ? void 0 : _a.length, 1);
    });
    test("should test array limits", () => {
        var _a;
        for (let index = 0; index < telemetryEventQueue_1.MAX_QUEUE_SIZE + 1; index++) {
            queue.addEvent(dummyEvent);
        }
        assert.strictEqual((_a = queue.events) === null || _a === void 0 ? void 0 : _a.length, telemetryEventQueue_1.MAX_QUEUE_SIZE);
    });
    test("should destroy the queue", () => {
        queue.emptyQueue();
        assert.strictEqual(queue.events, undefined);
    });
});
//# sourceMappingURL=telemetryEventQueue.test.js.map