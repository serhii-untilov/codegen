#!/usr/bin/env node
/**
 * CLI entry point (bin target)
 */
import chalk from 'chalk';
import { options } from './cli/command.js';
import { Generator } from './engine/generator.js';
import { failSpinner } from './helpers/spinner.js';
import { registerTransformHelpers } from './helpers/transforms.js';
(async () => {
    try {
        registerTransformHelpers();
        await options.resolve();
        await new Generator(options).run();
    }
    catch (err) {
        failSpinner('Generation failed.');
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();
