#!/usr/bin/env node
const fg = require("fast-glob");
const { resolve } = require("path");
const { cyan } = require("kolorist");
const { consola } = require("consola");
const { copyBin } = require("fast-cpy");
const { select, input } = require("@inquirer/prompts");

const log = consola.withTag("n-init");

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

  const dest = await input({
    default: `${answer}-starter`,
    message: "input your project name",
  });

  const src = resolve(__dirname, answer);

  await copyBin(src, dest);

  log.success(`Successfully generated → ${cyan(dest)}`);
}

init();
