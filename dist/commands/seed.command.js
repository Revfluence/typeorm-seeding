"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedCommand = void 0;
const ora = require("ora");
const chalk = require("chalk");
const importer_1 = require("../importer");
const file_util_1 = require("../utils/file.util");
const typeorm_seeding_1 = require("../typeorm-seeding");
const connection_1 = require("../connection");
class SeedCommand {
    constructor() {
        this.command = 'seed';
        this.describe = 'Runs the seeds';
    }
    builder(args) {
        return args
            .option('d', {
            alias: 'dataSource',
            demandOption: true,
            describe: 'Path to the file where your DataSource instance is defined.',
        })
            .option('seed', {
            alias: 's',
            describe: 'Specific seed class to run.',
        });
    }
    async handler(args) {
        const log = console.log;
        const pkg = require('../../package.json');
        log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`));
        const spinner = ora('Loading ormconfig').start();
        const configureOption = {
            dataSourcePath: args.dataSource,
        };
        let dataSource = null;
        // Get TypeORM config file
        let option;
        try {
            (0, connection_1.configureConnection)(configureOption);
            option = await (0, connection_1.getConnectionOptions)();
            dataSource = await (0, connection_1.loadDataSource)();
            spinner.succeed('ORM Config loaded');
            // Find all factories and seed with help of the config
            spinner.start('Import Factories');
            const factoryFiles = (0, file_util_1.loadFiles)(option.factories);
            try {
                await (0, file_util_1.importFiles)(factoryFiles);
                spinner.succeed('Factories are imported');
            }
            catch (error) {
                panic(spinner, error, 'Could not import factories!');
            }
            // Show seeds in the console
            spinner.start('Importing Seeders');
            const seedFiles = (0, file_util_1.loadFiles)(option.seeds);
            let seedFileObjects = [];
            try {
                seedFileObjects = await Promise.all(seedFiles.map((seedFile) => (0, importer_1.importSeed)(seedFile)));
                seedFileObjects = seedFileObjects.filter((seedFileObject) => args.seed === undefined || args.seed === seedFileObject.name);
                spinner.succeed('Seeders are imported');
            }
            catch (error) {
                panic(spinner, error, 'Could not import seeders!');
            }
            // Get database connection and pass it to the seeder
            spinner.start('Connecting to the database');
            try {
                await (0, connection_1.loadDataSource)();
                spinner.succeed('Database connected');
            }
            catch (error) {
                panic(spinner, error, 'Database connection failed! Check your typeORM config file.');
            }
            // Run seeds
            for (const seedFileObject of seedFileObjects) {
                spinner.start(`Executing ${seedFileObject.name} Seeder`);
                try {
                    await (0, typeorm_seeding_1.runSeeder)(seedFileObject);
                    spinner.succeed(`Seeder ${seedFileObject.name} executed`);
                }
                catch (error) {
                    panic(spinner, error, `Could not run the seed ${seedFileObject.name}!`);
                }
            }
            log('👍 ', chalk.gray.underline(`Finished Seeding`));
            process.exit(0);
        }
        catch (error) {
            panic(spinner, error, 'Could not load the config file!');
        }
    }
}
exports.SeedCommand = SeedCommand;
function panic(spinner, error, message) {
    spinner.fail(message);
    console.error(error);
    process.exit(1);
}
//# sourceMappingURL=seed.command.js.map