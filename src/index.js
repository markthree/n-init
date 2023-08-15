#!/usr/bin/env node
const fg = require("fast-glob");
const { resolve } = require("path");
const { cyan } = require("kolorist");
const { consola } = require("consola");
const { copy } = require("fast-cpy");
const { cwd } = require("process");
const { select, input } = require("@inquirer/prompts");

const log = consola.withTag("n-init-project");

async function init() {
  const projects = await fg("*", {
    onlyDirectories: true,
    cwd: resolve(__dirname, "../projects"),
  });

  const choices = projects.map((p) => ({ name: p, value: p }));

  const answer = await select({
    message: "Choose your template?",
    choices,
  });

  let dest = await input({
    default: `${answer}-starter`,
    message: "input your project name",
  });

  dest = resolve(process.cwd(), dest);

  const src = resolve(__dirname, answer);

  await copy(src, dest);

  log.success(`Successfully generated → ${cyan(dest)}`);
}

init();
