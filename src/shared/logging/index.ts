import { ConsoleLogger, LogLevel, type Logger } from "./Logger";

export let logger: Logger = new ConsoleLogger();

export const setLogger = (newLogger: Logger): void => {
  logger = newLogger;
};

export const setLogLevel = (level: LogLevel): void => {
  logger = new ConsoleLogger(level);
};

export { LogLevel, type Logger } from "./Logger";
