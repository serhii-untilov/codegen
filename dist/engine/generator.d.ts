/**
 * Main generation pipeline
 */
import { Options } from '../cli/options.js';
import { Context } from './context.js';
import { TemplateMeta } from './template-reader.js';
export type GeneratedFile = {
    fileName: string;
    meta: TemplateMeta;
    content: string;
};
export declare class Generator {
    private readonly options;
    private readonly context;
    private readonly templatePath;
    private readonly file;
    constructor(options: Options, context: Context, templatePath: string, file: string);
    run(): Promise<GeneratedFile>;
    makeTargetFileName(file: string, name: string, meta: TemplateMeta): string;
}
