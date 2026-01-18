#!/usr/bin/env node
import chalk from 'chalk';
import { options } from './cli/command.js';
import { resolveName, resolveOutputFolder } from './cli/prompts.js';
import { generate } from './engine/generator.js';
import { failSpinner } from './helpers/spinner.js';

(async () => {
    try {
        const artifactName = await resolveName(options.name);
        const outputRoot = await resolveOutputFolder(options.output);
        await generate(options.templates, artifactName, outputRoot);
    } catch (err: any) {
        failSpinner('Generation failed.');
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();
