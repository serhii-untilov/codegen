/**
 * Read templates/files
 */
export declare function getTemplatePath(templateFolder: string): string;
export declare function getTemplateFile(templateFolder: string, relativeTemplatePath: string): string;
export declare function getTemplateContent(templateFile: string): Promise<string>;
