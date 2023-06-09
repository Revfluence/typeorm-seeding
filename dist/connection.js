"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDataSource = exports.resetDataSource = exports.getConnectionOptions = exports.setConnectionOptions = exports.configureConnection = void 0;
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const KEY = 'TypeORM_Seeding_Connection';
if (global[KEY] === undefined) {
    ;
    global[KEY] = {
        dataSource: undefined,
        dataSourcePath: undefined,
        ormConfig: undefined,
        connection: undefined,
        overrideConnectionOptions: {
            factories: [process.env.TYPEORM_SEEDING_FACTORIES || 'src/database/factories/**/*{.ts,.js}'],
            seeds: [process.env.TYPEORM_SEEDING_SEEDS || 'src/database/seeds/**/*{.ts,.js}'],
        },
    };
}
const configureConnection = (option = {}) => {
    ;
    global[KEY] = {
        ...global[KEY],
        ...option,
    };
};
exports.configureConnection = configureConnection;
const setConnectionOptions = (options) => {
    ;
    global[KEY].overrideConnectionOptions = {
        ...global[KEY].overrideConnectionOptions,
        ...options,
    };
};
exports.setConnectionOptions = setConnectionOptions;
const getConnectionOptions = async () => {
    return global[KEY].overrideConnectionOptions;
};
exports.getConnectionOptions = getConnectionOptions;
const resetDataSource = async () => {
    ;
    global[KEY].overrideConnectionOptions = {};
    const ds = global[KEY].dataSource;
    if (ds) {
        ;
        global[KEY].dataSource = undefined;
        return ds && ds.isInitialized ? ds.destroy() : undefined;
    }
};
exports.resetDataSource = resetDataSource;
const loadDataSource = async (options) => {
    const { dataSourcePath, dataSource, overrideConnectionOptions } = global[KEY];
    let ds;
    if (!dataSource) {
        if (dataSourcePath) {
            ds = (await require((0, path_1.resolve)(process.cwd(), dataSourcePath))).default;
            ds.setOptions({ ...overrideConnectionOptions, ...options });
        }
        else {
            ds = new typeorm_1.DataSource({ ...overrideConnectionOptions, ...options });
        }
        await ds.initialize();
        global[KEY].dataSource = ds;
    }
    return global[KEY].dataSource;
};
exports.loadDataSource = loadDataSource;
//# sourceMappingURL=connection.js.map