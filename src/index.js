#!/usr/bin/env node
const fg = require("fast-glob");
const { resolve } = require("path");
const { cyan } = require("kolorist");
const { consola } = require("consola");
const { copy } = require("fast-cpy");
const { existsSync } = require("fs");
const { execSync } = require("child_process");
const { fixPackageJson } = require("node-sass-version-fix");
const { select, input, confirm } = require("@inquirer/prompts");
const { syncNpmrc } = require("./rc");

const log = consola.withTag("n-init-project");

async function init() {
  const projectsDir = resolve(__dirname, "../projects");

  const projects = await fg("*", {
    onlyDirectories: true,
    cwd: projectsDir,
  });

  const choices = projects.map((p) => ({ name: p, value: p }));

  const answer = await select({
    message: "选择你的模板?",
    choices,
  });

  let dest = await input({
    default: `${answer}-starter`,
    message: "输入你的项目名",
  });

  dest = resolve(process.cwd(), dest);

  if (existsSync(dest)) {
    log.error("你的项目已存在，请换一个项目名");
    return;
  }

  const src = resolve(projectsDir, answer);

  await copy(src, dest);

  if (answer === "vuecli-vue2") {
    await fixPackageJson(resolve(dest, "package.json"));
    log.success("自动 fix node-sass 版本");
  }

  await syncNpmrc(answer, dest);

  log.success(`同步 .npmrc → ${cyan(resolve(dest, ".npmrc"))}`);

  log.success(`生成项目成功 → ${cyan(dest)}`);

  const isNuxt = answer === "nuxt";

  const isNitro = answer === "nitro";

  if (isNuxt || isNitro) {
    const pkg = isNitro ? "nitropack" : "nuxt";
    const cmd = await select({
      message: "选择你使用的包管理器?",
      choices: [{
        name: "npm",
        value: `npm install ${pkg} -D && npm run prepare`,
      }, {
        name: "yarn",
        value: `yarn add ${pkg} -D && yarn prepare`,
      }, {
        name: "pnpm",
        value: `pnpm install ${pkg} -D && pnpm prepare`,
      }],
    });
    log.info(`执行命令 → ${cyan(cmd)}`);
    execSync(cmd, {
      stdio: "inherit",
      cwd: dest,
    });
    log.success(`安装项目成功`);
    return;
  }

  const autoInstall = await confirm({
    default: true,
    message: "是否自动 install",
  });

  if (autoInstall) {
    const cmd = await select({
      message: "选择你使用的包管理器?",
      choices: [{
        name: "npm",
        value: "npm install",
      }, {
        name: "yarn",
        value: "yarn",
      }, {
        name: "pnpm",
        value: "pnpm install",
      }],
    });

    log.info(`执行命令 → ${cyan(cmd)}`);

    execSync(cmd, {
      stdio: "inherit",
      cwd: dest,
    });

    log.success(`安装项目成功`);
  }
}

init();
