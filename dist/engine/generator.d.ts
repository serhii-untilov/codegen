/**
 * Main generation pipeline
 */
import { Options } from '../cli/options.js';
import { TemplateMeta } from './template-reader.js';
export declare class Generator {
    private readonly options;
    constructor(options: Options);
    run(): Promise<void>;
    makeTargetFileName(file: string, name: string, meta: TemplateMeta): string;
}
