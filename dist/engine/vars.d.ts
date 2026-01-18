export declare function initVars(newVars: Record<string, any>): void;
export declare function setVar(key: string, value: any): void;
export declare function getVar(key: string): any;
export declare function getAllVars(): Record<string, any>;
export declare function clearVars(): void;
export declare function getUndefinedVars(templateVars: string[]): string[];
export declare function addVars(newVars: Record<string, any>): void;
export declare function resolveUndefinedVars(templateContent: string, file: string): Promise<void>;
