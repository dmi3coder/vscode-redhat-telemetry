"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdManagerFactory = void 0;
const cheIdManager_1 = require("../che/cheIdManager");
const fileSystemIdManager_1 = require("./fileSystemIdManager");
const gitpodIdManager_1 = require("../gitpod/gitpodIdManager");
var IdManagerFactory;
(function (IdManagerFactory) {
    function getIdManager() {
        if (process.env['CHE_WORKSPACE_ID']) {
            return new cheIdManager_1.CheIdManager();
        }
        else if (process.env['GITPOD_GIT_USER_EMAIL']) {
            return new gitpodIdManager_1.GitpodIdManager();
        }
        return new fileSystemIdManager_1.FileSystemIdManager();
    }
    IdManagerFactory.getIdManager = getIdManager;
})(IdManagerFactory = exports.IdManagerFactory || (exports.IdManagerFactory = {}));
//# sourceMappingURL=idManagerFactory.js.map