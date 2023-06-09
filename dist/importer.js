"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSeed = void 0;
const importSeed = async (filePath) => {
    const seedFileObject = await Promise.resolve().then(() => require(filePath));
    const keys = Object.keys(seedFileObject);
    return seedFileObject[keys[0]];
};
exports.importSeed = importSeed;
//# sourceMappingURL=importer.js.map