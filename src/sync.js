import { existsSync } from "fs";
import { resolve } from "path";
import { appendFile, readFile, writeFile } from "fs/promises";

// Npmrc will be ignored by npm, so manual synchronization is required
const npmrcs = {
  "nuxt": [
    "shamefully-hoist=true",
    "auto-install-peers=true",
    "registry=https://registry.npmmirror.com/",
  ],
  "nitro": [
    "shamefully-hoist=true",
    "auto-install-peers=true",
    "registry=https://registry.npmmirror.com/",
  ],
  "vuecli-vue2": [
    "registry=https://registry.npmmirror.com/",
    "sass_binary_site=https://npm.taobao.org/mirrors/node-sass/",
  ],
};

// Gitignores will be ignored by npm, so manual synchronization is required
const gitignores = {
  "nuxt": [
    "dist",
    ".nitro",
    ".nuxt",
    ".output",
    "node_modules",
  ],
  "nitro": [
    "dist",
    ".nuxt",
    ".nitro",
    ".output",
    "node_modules",
  ],
  "vuecli-vue2": [
    "dist",
    "node_modules",
  ],
};

async function write(
  record,
  dest,
  name = ".npmrc",
) {
  const file = resolve(dest, name);
  if (!existsSync(file)) {
    await writeFile(file, record, { encoding: "utf-8" });
  } else {
    const text = await readFile(file, { encoding: "utf-8" });
    if (!text.includes(record)) {
      await appendFile(file, "\n" + record);
    }
  }
}

export async function syncNpmrc(project, dest) {
  const npmrc = npmrcs[project];
  if (npmrc) {
    for (const record of npmrc) {
      await write(record, dest, ".npmrc");
    }
  }
}

export async function syncGitignore(project, dest) {
  const gitignore = gitignores[project];
  if (gitignore) {
    for (const record of gitignore) {
      await write(record, dest, ".gitignore");
    }
  }
}
