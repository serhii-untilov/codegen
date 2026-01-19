/**
 * Main generation pipeline
 */
import { Options } from '../cli/options.js';
export declare class Generator {
    private readonly options;
    constructor(options: Options);
    run(): Promise<void>;
}
