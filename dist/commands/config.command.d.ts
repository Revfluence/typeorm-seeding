import * as yargs from 'yargs';
export declare class ConfigCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        d: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
