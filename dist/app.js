#!/usr/bin/env node
import chalk from 'chalk';
import { options } from './cli/command.js';
import { resolveName, resolveOutputFolder } from './cli/prompts.js';
import { Generator } from './engine/generator.js';
import { failSpinner } from './helpers/spinner.js';
import { registerTransformHelpers } from './helpers/transform.js';
(async () => {
    try {
        const artifactName = await resolveName(options.name);
        const outputRoot = await resolveOutputFolder(options.output);
        registerTransformHelpers();
        await new Generator(options.templates, artifactName, outputRoot).run();
    }
    catch (err) {
        failSpinner('Generation failed.');
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();
