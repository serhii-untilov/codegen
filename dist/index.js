#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { generate } from "./generator.js";
const program = new Command();
program.name("codegen").description("Multi-language code generation CLI").version("1.0.0");
program
    .option("-t, --templates <folder>", "Templates folder", "./templates/python.class")
    .option("-n, --name <name|?>", "Name for generated artifact", "Example")
    .option("-o, --output <folder|?>", "Output folder", "src");
program.parse(process.argv);
const options = program.opts();
const templatesPath = path.resolve(options.templates);
if (!fs.existsSync(templatesPath)) {
    console.error(chalk.red(`Templates folder not found: ${templatesPath}`));
    process.exit(1);
}
(async () => {
    try {
        const name = await resolveName(options.name);
        const output = await resolveOutputFolder(options.output);
        await generate(templatesPath, name, output);
    }
    catch (err) {
        ora().fail("Generation failed.");
        console.error(err.message);
        process.exit(1);
    }
})();
async function resolveName(name) {
    if (name !== "?") {
        return name;
    }
    const { artifactName } = await inquirer.prompt([
        {
            type: "input",
            name: "artifactName",
            message: "Enter name for generated artifact:",
            validate: (input) => input.trim().length > 0 || "Name cannot be empty",
        },
    ]);
    return artifactName;
}
async function resolveOutputFolder(name) {
    if (name !== "?") {
        return name;
    }
    const { outputFolderName } = await inquirer.prompt([
        {
            type: "input",
            name: "outputFolderName",
            message: "Enter name for the output folder name:",
            validate: (input) => input.trim().length > 0 || "Folder name cannot be empty",
        },
    ]);
    return outputFolderName;
}
