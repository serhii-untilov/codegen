import { Command } from 'commander';
const program = new Command();
program.name('codegen').description('Multi-language code generation CLI').version('1.0.0');
program
    .option('-t, --templates <folder>', 'Templates folder', './templates/python.class')
    .option('-n, --name <name|?>', 'Name for generated artifact', 'Example')
    .option('-o, --output <folder|?>', 'Output folder', 'src');
program.parse(process.argv);
export const options = program.opts();
