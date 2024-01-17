import { dirname } from "path";
import { existsSync } from "fs";
import { appendFile, mkdir } from "fs/promises";

export async function writeLog(file, text) {
  if (!existsSync(file)) {
    await mkdir(dirname(file), {
      recursive: true,
    });
  }
  return appendFile(file, `${text}\n`, { encoding: "utf-8" });
}

const timeRtf = new Intl.DateTimeFormat("zh-cn", {
  dateStyle: "short",
  timeStyle: "medium",
});

const dateRtf = new Intl.DateTimeFormat("zh-cn", {
  dateStyle: "short",
});

export function createLogInfo(event = useEvent()) {
  const now = Date.now();
  const time = timeRtf.format(now);
  const date = dateRtf.format(now);
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "";
  return { now, ip, time, date };
}
