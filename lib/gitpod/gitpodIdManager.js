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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitpodIdManager = void 0;
const uuid_1 = require("../utils/uuid");
let userId;
class GitpodIdManager {
    getRedHatUUID() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                userId = this.loadRedHatUUID();
            }
            return userId;
        });
    }
    loadRedHatUUID(redhatDir) {
        try {
            const email = process.env.GITPOD_GIT_USER_EMAIL;
            if (email) {
                userId = uuid_1.UUID.generateUUID(email);
                const anonymousIdFile = uuid_1.UUID.getAnonymousIdFile(redhatDir);
                const existingId = uuid_1.UUID.readFile(anonymousIdFile);
                if (existingId !== userId) {
                    uuid_1.UUID.writeFile(anonymousIdFile, userId);
                }
                return userId;
            }
        }
        catch (error) {
            console.log('Failed to get user id from Gitpod', error);
        }
        //fall back to generating a random UUID
        console.log('fall back to generating a random UUID');
        return uuid_1.UUID.getRedHatUUID();
    }
}
exports.GitpodIdManager = GitpodIdManager;
//# sourceMappingURL=gitpodIdManager.js.map