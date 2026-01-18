export declare class Generator {
    private readonly templatesFolder;
    private readonly artifactName;
    private readonly outputRoot;
    constructor(templatesFolder: string, artifactName: string, outputRoot: string);
    run(): Promise<void>;
}
