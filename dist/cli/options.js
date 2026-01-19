/**
 * CLI options & flags types
 */
import { resolveName, resolveOutputFolder } from './prompts.js';
export class Options {
    constructor(options) {
        this.templates = options.templates;
        this.name = options.name;
        this.output = options.output;
    }
    async resolve() {
        this.name = await resolveName(this.name);
        this.output = await resolveOutputFolder(this.output);
    }
}
