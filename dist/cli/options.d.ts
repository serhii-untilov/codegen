/**
 * CLI options & flags types
 */
export declare class Options {
    templates: string;
    name: string;
    output: string;
    constructor(options: Options);
    resolve(): Promise<void>;
}
