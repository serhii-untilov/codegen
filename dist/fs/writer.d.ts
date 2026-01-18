export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function makeOutputFolder(outputRoot: string, templatePath: string, file: string, artifactName: string): Promise<string>;
export declare function makeOutputFilePath(folder: string, file: string, artifactName: string): string;
export declare function makeOutputFileName(file: string, artifactName: string): string;
