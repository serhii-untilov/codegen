/**
 * CLI options & flags types
 */

import { resolveName, resolveOutputFolder } from './prompts.js';

export class Options {
    public templates: string;
    public name: string;
    public output: string;

    constructor(options: Options) {
        this.templates = options.templates;
        this.name = options.name;
        this.output = options.output;
    }

    async resolve() {
        this.name = await resolveName(this.name);
        this.output = await resolveOutputFolder(this.output);
    }
}
