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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const gitpodIdManager_1 = require("../../gitpod/gitpodIdManager");
const uuid_1 = require("../../utils/uuid");
const redhatDir = `${process.cwd()}/.redhat/`;
suite('Test gitpod id manager', () => {
    setup(() => {
        (0, mock_fs_1.default)({
            '.redhat': {
                'anonymousId': 'some-uuid'
            }
        });
    });
    teardown(() => {
        mock_fs_1.default.restore();
    });
    test('Should generate Red Hat UUID from GITPOD_GIT_USER_EMAIL env', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.GITPOD_GIT_USER_EMAIL = 'some.user@company.com';
        console.log(process.env.GITPOD_GIT_USER_EMAIL);
        const gitpod = new gitpodIdManager_1.GitpodIdManager();
        const id = gitpod.loadRedHatUUID(redhatDir);
        const expectedId = '465b7cd6-0f77-5fc8-97ed-7b6342df109f';
        assert.strictEqual(id, expectedId);
        //Check anonymousId file was updated
        const anonymousId = uuid_1.UUID.readFile(uuid_1.UUID.getAnonymousIdFile(redhatDir));
        assert.strictEqual(anonymousId, id);
    }));
});
//# sourceMappingURL=gitpodIdManager.test.js.map