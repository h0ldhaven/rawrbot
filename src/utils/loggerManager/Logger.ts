import chalk from "chalk";
import dayjs from "dayjs";

const format = "{tstamp} {tag} {txt}\n";

function log(tag: string, color: (text: string) => string, message: string, isError = false) {
  const timestamp = `[${dayjs().format("DD/MM - HH:mm:ss")}]`;
  const logTag = `[${tag}]`;
  const stream = isError ? process.stderr : process.stdout;

  stream.write(
    format
      .replace("{tstamp}", chalk.gray(timestamp))
      .replace("{tag}", color(logTag))
      .replace("{txt}", chalk.white(message))
  );
}

export const Logger = {
  info: (msg: string) => log("INFO", chalk.blue, msg),
  warn: (msg: string) => log("WARN", chalk.yellow, msg),
  error: (msg: string) => log("ERROR", chalk.red, msg, true),
  command: (msg: string) => log("CMD", chalk.magenta, msg),
};