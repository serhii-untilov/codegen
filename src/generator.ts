import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import chalk from "chalk";
import { extractTemplateVariables, getAnswers, getOutputFileName, registerHelpers } from "./helpers.js";
import { glob } from "glob";

registerHelpers();

export async function generate(
  templatesPath: string,
  artifactName: string,
  outputRoot: string
) {
  if (!fs.existsSync(templatesPath))
    throw new Error(`Templates folder not found: ${templatesPath}`);

  // read all template files in templatesPath folder
  const files = await glob("**/*.hbs", { cwd: templatesPath });
  console.log(chalk.blue(`Found ${files.length} template(s) in ${templatesPath}`));

  const globalVariables: Record<string, any> = { name: artifactName };

  for (const file of files) {
    const templateFile = path.join(templatesPath, file);
    const templateContent = await fs.readFile(templateFile, "utf-8");
    const templateVariables = extractTemplateVariables(templateContent);
    const answers = await getAnswers(templateVariables.filter(v => !(v in globalVariables)));
    Object.assign(globalVariables, answers);
    const template = Handlebars.compile(templateContent);
    const rendered = template(globalVariables);

    const relativePath = path.relative(templatesPath, path.dirname(templateFile))
    const outputPath = getOutputFileName(relativePath, artifactName);
    const outputFolder = path.resolve(outputRoot, outputPath);
    await fs.ensureDir(outputFolder);

    const outputFileName = getOutputFileName(path.basename(file), artifactName);
    const outputFilePath = path.join(outputFolder, outputFileName);

    await fs.writeFile(outputFilePath, rendered);
    console.log(chalk.green(`Generated: ${outputFilePath}`));
  }
}
