"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const configuration_1 = require("../../services/configuration");
suite('Test configurations', () => {
    const all = {
        "enabled": "all",
        "includes": [
            {
                "name": "*"
            }
        ]
    };
    const identify = {
        "enabled": "all",
        "includes": [
            {
                "name": "identify"
            }
        ]
    };
    const off = {
        "enabled": "off",
        "includes": [
            {
                "name": "*"
            }
        ]
    };
    const errors = {
        "enabled": "error",
        "excludes": [
            {
                "property": "error",
                "value": "*stackoverflow*"
            }
        ]
    };
    const ratioed = {
        "ratio": "0.3"
    };
    test('Should allow all events', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = new configuration_1.Configuration(all);
        let event = { event: "something" };
        assert_1.default.ok(config.canSend(event) === true);
    }));
    test('Should not allow any events', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = new configuration_1.Configuration(off);
        let event = { event: "something" };
        assert_1.default.ok(config.canSend(event) === false);
    }));
    test('Should filter events by name', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = new configuration_1.Configuration(identify);
        let event = {
            event: "identify"
        };
        assert_1.default.ok(config.canSend(event) === true);
        event = {
            event: "startup"
        };
        assert_1.default.ok(config.canSend(event) === false);
    }));
    test('Should only allow errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = new configuration_1.Configuration(errors);
        let event = {
            event: "startup"
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
        event = {
            event: "failed-analysis",
            properties: {
                "error": "Ohoh, an error occurred!"
            }
        };
        assert_1.default.ok(config.canSend(event) === true, `${event.event} should be sent`);
        event = {
            event: "crash-analysis",
            properties: {
                "error": "Bla bla stackoverflow bla"
            }
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
    }));
    test('Should only allow errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = new configuration_1.Configuration(errors);
        let event = {
            event: "startup"
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
        event = {
            event: "failed-analysis",
            properties: {
                "error": "Ohoh, an error occurred!"
            }
        };
        assert_1.default.ok(config.canSend(event) === true, `${event.event} should be sent`);
        event = {
            event: "crash-analysis",
            properties: {
                "error": "Bla bla stackoverflow bla"
            }
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
    }));
    test('Should apply ratio on userId', () => __awaiter(void 0, void 0, void 0, function* () {
        /*
        d0b7ac12-caa0-4253-8087-788ff0b1c293 hashcode:-1654400659 numvalue:0.59
        8668869d-a068-412b-9e59-4fec9dc0483a hashcode:-1782924593 numvalue:0.93
        8b7fe10d-bb9d-434c-afed-4fb03f3b626e hashcode:1373002981 numvalue:0.81
        533629ec-091b-474b-95e6-3aa0eef3e940 hashcode:-69430422 numvalue:0.22
        ceef2ce6-72e1-4ebf-9493-8df2d84b3eb9 hashcode:-1217376767 numvalue:0.67
        21b888d6-8f85-46a7-b6e6-02eee2acc9e8 hashcode:-1078388279 numvalue:0.79
        46d2c605-d94b-4136-9420-0c5adc205e8f hashcode:-1747529146 numvalue:0.46
        29c02d6c-6708-4166-a38c-d219c87bd824 hashcode:1917228150 numvalue:0.5
        aa7565e7-e032-4f94-b7c1-830046286bb3 hashcode:1447488847 numvalue:0.47
        cd304b68-3512-4af5-8991-377479bfede6 hashcode:-449137339 numvalue:0.39
        */
        const config = new configuration_1.Configuration(ratioed);
        let event = {
            userId: "d0b7ac12-caa0-4253-8087-788ff0b1c293",
            event: "startup"
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
        event = {
            userId: "533629ec-091b-474b-95e6-3aa0eef3e940",
            event: "startup",
        };
        assert_1.default.ok(config.canSend(event) === true, `${event.event} should be sent`);
        event = {
            userId: "cd304b68-3512-4af5-8991-377479bfede6",
            event: "startup",
        };
        assert_1.default.ok(config.canSend(event) === false, `${event.event} shouldn't be sent`);
    }));
});
//# sourceMappingURL=configuration.test.js.map