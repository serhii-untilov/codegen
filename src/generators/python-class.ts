import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import chalk from "chalk";

export async function generatePythonClass(templatesPath: string, name: string) {
  const templateFile = path.join(templatesPath, "python-class.hbs");
  if (!fs.existsSync(templateFile)) throw new Error("Template not found");

  const templateContent = await fs.readFile(templateFile, "utf-8");
  const template = Handlebars.compile(templateContent);
  const rendered = template({ name });

  const outputPath = path.resolve("src", `${name}.py`);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, rendered);

  console.log(chalk.green(`Python class generated at ${outputPath}`));
}
