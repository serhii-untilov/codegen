export declare class Vars {
    private readonly vars;
    constructor(vars?: Record<string, any>);
    setVar(key: string, value: any): void;
    getVar(key: string): any;
    getAllVars(): Record<string, any>;
    clearVars(): void;
    getUndefinedVars(templateVars: string[]): string[];
    addVars(newVars: Record<string, any>): void;
    resolveUndefinedVars(templateContent: string, file: string): Promise<void>;
}
