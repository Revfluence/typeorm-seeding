import { DataSource, DataSourceOptions } from 'typeorm';
interface SeedingOptions {
    factories: string[];
    seeds: string[];
}
export declare type ConnectionOptions = DataSourceOptions & SeedingOptions;
export interface ConfigureOption {
    dataSourcePath?: string;
}
export declare const configureConnection: (option?: ConfigureOption) => void;
export declare const setConnectionOptions: (options: Partial<ConnectionOptions>) => void;
export declare const getConnectionOptions: () => Promise<ConnectionOptions>;
export declare const resetDataSource: () => Promise<void>;
export declare const loadDataSource: (options?: DataSourceOptions) => Promise<DataSource>;
export {};
