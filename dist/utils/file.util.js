"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFiles = exports.importFiles = void 0;
const glob = require("glob");
const path = require("path");
const importFiles = async (filePaths) => {
    await Promise.all(filePaths.map((filePath) => Promise.resolve().then(() => require(filePath))));
};
exports.importFiles = importFiles;
const loadFiles = (filePattern) => {
    return filePattern
        .map((pattern) => glob.sync(path.resolve(process.cwd(), pattern)))
        .reduce((acc, filePath) => acc.concat(filePath), []);
};
exports.loadFiles = loadFiles;
//# sourceMappingURL=file.util.js.map