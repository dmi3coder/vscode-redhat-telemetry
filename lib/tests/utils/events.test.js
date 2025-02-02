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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../../utils/events"));
const assert = __importStar(require("assert"));
const env = {
    application: {
        name: 'SuperCode',
        version: '6.6.6'
    },
    extension: {
        name: 'my-ext',
        version: '1.2.3'
    },
    username: 'Fred',
    platform: {
        name: 'DeathStar II'
    },
};
suite('Test events enhancements', () => {
    test('should inject environment data', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            name: 'Something',
            properties: {
                foo: 'bar',
            }
        };
        const betterEvent = utils.enhance(event, env);
        assert.strictEqual(betterEvent.properties.app_name, 'SuperCode');
        assert.strictEqual(betterEvent.properties.app_version, '6.6.6');
        assert.strictEqual(betterEvent.properties.extension_name, 'my-ext');
        assert.strictEqual(betterEvent.properties.extension_version, '1.2.3');
        assert.strictEqual(betterEvent.properties.foo, 'bar');
        assert.strictEqual(betterEvent.context.ip, '0.0.0.0');
    }));
    test('should anonymize data', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            name: 'Something',
            properties: {
                foo: 'Fred is Fred',
                qty: 10,
                active: false,
                bar: 'That c:\\Fred\\bar looks like a path',
                error: 'An error occured in /Users/Fred/foo/bar.txt! But we\'re fine',
                multiline: 'That url file://Fred/bar.txt is gone!\nNot that c:\\user\\bar though',
                obj: {
                    q: 'Who is Fred?',
                    a: 'Fred who?'
                }
            }
        };
        const betterEvent = utils.enhance(event, env);
        assert.strictEqual(betterEvent.properties.qty, 10);
        assert.strictEqual(betterEvent.properties.active, false);
        assert.strictEqual(betterEvent.properties.foo, '_username_ is _username_');
        assert.strictEqual(betterEvent.properties.bar, 'That c:\\_username_\\bar looks like a path');
        assert.strictEqual(betterEvent.properties.error, 'An error occured in /Users/_username_/foo/bar.txt! But we\'re fine');
        assert.strictEqual(betterEvent.properties.multiline, 'That url file://_username_/bar.txt is gone!\nNot that c:\\user\\bar though');
        assert.strictEqual(betterEvent.properties.obj.q, 'Who is _username_?');
        assert.strictEqual(betterEvent.properties.obj.a, '_username_ who?');
    }));
    test('should not anonymize special usernames', () => __awaiter(void 0, void 0, void 0, function* () {
        utils.IGNORED_USERS.forEach((user) => {
            const cheEnv = {
                application: {
                    name: 'SuperCode',
                    version: '6.6.6'
                },
                extension: {
                    name: 'my-ext',
                    version: '1.2.3'
                },
                username: user,
                platform: {
                    name: 'DeathStar II'
                },
            };
            const event = {
                name: 'Something',
                properties: {
                    foo: 'user likes theia',
                    multiline: 'That gitpod \nusername is woke',
                }
            };
            const betterEvent = utils.enhance(event, cheEnv);
            assert.strictEqual(betterEvent.properties.foo, event.properties.foo);
            assert.strictEqual(betterEvent.properties.multiline, event.properties.multiline);
        });
    }));
});
//# sourceMappingURL=events.test.js.map