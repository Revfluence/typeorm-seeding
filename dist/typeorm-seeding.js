"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSeeding = exports.tearDownDatabase = exports.useRefreshDatabase = exports.runSeeder = exports.factory = exports.define = exports.times = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const entity_factory_1 = require("./entity-factory");
const factory_util_1 = require("./utils/factory.util");
const file_util_1 = require("./utils/file.util");
const connection_1 = require("./connection");
// -------------------------------------------------------------------------
// Handy Exports
// -------------------------------------------------------------------------
tslib_1.__exportStar(require("./importer"), exports);
tslib_1.__exportStar(require("./connection"), exports);
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "times", { enumerable: true, get: function () { return helpers_1.times; } });
global.seeder = {
    entityFactories: new Map(),
};
// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------
const define = (entity, factoryFn) => {
    ;
    global.seeder.entityFactories.set((0, factory_util_1.getNameOfEntity)(entity), {
        entity,
        factory: factoryFn,
    });
};
exports.define = define;
const factory = (entity) => (context) => {
    const name = (0, factory_util_1.getNameOfEntity)(entity);
    const entityFactoryObject = global.seeder.entityFactories.get(name);
    return new entity_factory_1.EntityFactory(name, entity, entityFactoryObject.factory, context);
};
exports.factory = factory;
const runSeeder = async (clazz) => {
    const seeder = new clazz();
    const dataSource = await (0, connection_1.loadDataSource)();
    return seeder.run(exports.factory, dataSource);
};
exports.runSeeder = runSeeder;
// -------------------------------------------------------------------------
// Facade functions for testing
// -------------------------------------------------------------------------
const useRefreshDatabase = async (options = {}) => {
    (0, connection_1.configureConnection)(options);
    const dataSource = await (0, connection_1.loadDataSource)();
    if (dataSource && dataSource.isInitialized) {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    }
    return dataSource;
};
exports.useRefreshDatabase = useRefreshDatabase;
const tearDownDatabase = async () => {
    return (0, connection_1.resetDataSource)();
};
exports.tearDownDatabase = tearDownDatabase;
const useSeeding = async (options = {}) => {
    (0, connection_1.configureConnection)(options);
    const option = await (0, connection_1.getConnectionOptions)();
    const factoryFiles = (0, file_util_1.loadFiles)(option.factories);
    await (0, file_util_1.importFiles)(factoryFiles);
};
exports.useSeeding = useSeeding;
//# sourceMappingURL=typeorm-seeding.js.map