import { resolve } from "path";

// 日志记录
export default defineNitroPlugin((nitroApp) => {
  const { logsDir } = useAppConfig();

  nitroApp.hooks.hook("request", (event) => {
    const { now, ip, time, date } = createLogInfo(event);
    event.context.startTime = now;
    const record = `${time} --> ${event.path} ${ip}`;
    console.log(record);
    writeLog(resolve(logsDir, date), record);
  });

  nitroApp.hooks.hook("afterResponse", (event) => {
    const { now, ip, time, date } = createLogInfo(event);
    const duration = now - event.context.startTime;
    const record = `${time} <-- ${event.path} ${ip} ${duration}ms`;
    console.log(record);
    writeLog(resolve(logsDir, date), record);
  });

  nitroApp.hooks.hook("error", async (error, { event }) => {
    const { ip, time, date } = createLogInfo(event);
    const record = `${time} ${event.path} ${ip} ${error}`;
    console.error(record);
    writeLog(resolve(`${logsDir}/error`, date), record);
  });
});
