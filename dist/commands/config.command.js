"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const chalk = require("chalk");
const log_util_1 = require("../utils/log.util");
const connection_1 = require("../connection");
class ConfigCommand {
    constructor() {
        this.command = 'config';
        this.describe = 'Show the TypeORM config';
    }
    builder(args) {
        return args.option('d', {
            alias: 'dataSource',
            demandOption: true,
            describe: 'Path to the file where your DataSource instance is defined.',
        });
    }
    async handler(args) {
        const log = console.log;
        const pkg = require('../../package.json');
        log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`));
        try {
            (0, connection_1.configureConnection)({
                dataSourcePath: args.dataSource,
            });
            const ds = await (0, connection_1.loadDataSource)();
            log(ds.options);
        }
        catch (error) {
            (0, log_util_1.printError)('Could not find the orm config file', error);
            process.exit(1);
        }
        process.exit(0);
    }
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=config.command.js.map