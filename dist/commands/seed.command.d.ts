import * as yargs from 'yargs';
export declare class SeedCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        d: unknown;
    } & {
        seed: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
