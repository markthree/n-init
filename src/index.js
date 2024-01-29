#!/usr/bin/env node
import { glob } from "fast-glob";
import { dirname, resolve } from "path";
import { cyan } from "kolorist";
import { createConsola } from "consola";
import { copy } from "fs-extra";
import { existsSync } from "fs";
import { execSync } from "child_process";
import { fixPackageJson } from "node-sass-version-fix";
import { syncGitignore, syncNpmrc } from "./sync";
import { fileURLToPath } from "url";

const log = createConsola().withTag("n-init-project");

const _dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  const projectsDir = resolve(_dirname, "../projects");

  const projects = await glob("*", {
    onlyDirectories: true,
    cwd: projectsDir,
  });

  const choices = projects.map((p) => ({ label: p, value: p }));

  const answer = await log.prompt("选择你的模板?", {
    type: "select",
    options: choices,
  });

  let dest = await log.prompt("输入你的项目名", {
    type: "text",
    default: `${answer}-starter`,
    placeholder: `${answer}-starter`,
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

  await syncGitignore(answer, dest);

  log.success(`同步 .gitignore → ${cyan(resolve(dest, ".gitignore"))}`);

  log.success(`生成项目成功 → ${cyan(dest)}`);

  const isNuxt = answer === "nuxt";

  const isNitro = answer === "nitro";

  if (isNuxt || isNitro) {
    const pkg = isNitro ? "nitropack" : "nuxt @nuxt/devtools";
    const cmd = await log.prompt("选择你使用的包管理器?", {
      type: "select",
      options: [{
        label: "npm",
        value: `npm install ${pkg} -D && npm run prepare`,
      }, {
        label: "yarn",
        value: `yarn add ${pkg} -D && yarn prepare`,
      }, {
        label: "pnpm",
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

  const autoInstall = await log.prompt("是否自动 install", {
    type: "confirm",
    default: true,
  });

  if (autoInstall) {
    const cmd = await log.prompt("选择你使用的包管理器?", {
      type: "select",
      options: [{
        label: "npm",
        value: "npm install",
      }, {
        label: "yarn",
        value: "yarn",
      }, {
        label: "pnpm",
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
