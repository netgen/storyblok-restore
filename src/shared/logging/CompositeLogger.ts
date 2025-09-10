import type { Logger, LogLevel } from "./Logger";

export class CompositeLogger implements Logger {
  constructor(private loggers: Logger[]) {}

  error(message: string, ...args: unknown[]): void {
    this.loggers.forEach((logger) => logger.error(message, ...args));
  }

  warn(message: string, ...args: unknown[]): void {
    this.loggers.forEach((logger) => logger.warn(message, ...args));
  }

  info(message: string, ...args: unknown[]): void {
    this.loggers.forEach((logger) => logger.info(message, ...args));
  }

  debug(message: string, ...args: unknown[]): void {
    this.loggers.forEach((logger) => logger.debug(message, ...args));
  }

  setLogLevels(levels: LogLevel[]): void {
    this.loggers.forEach((logger) => logger.setLogLevels(levels));
  }
}
