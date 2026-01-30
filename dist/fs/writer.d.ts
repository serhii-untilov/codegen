/**
 * Write / patch files
 */
import { TemplateMeta } from '../engine/template-reader.js';
export declare class Writer {
    private readonly folderPath;
    constructor(folderPath: string);
    write(fileName: string, meta: TemplateMeta, content: string): Promise<void>;
}
export declare function filePath(folderPath: string, fileName: string): Promise<string>;
export declare function writeFile(folderPath: string, fileName: string, content: string): Promise<string>;
export declare function fileExists(folderPath: string, fileName: string): Promise<boolean>;
