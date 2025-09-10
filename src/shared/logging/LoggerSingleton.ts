import type { Logger } from "./Logger";
import { LogLevel } from "./Logger";
import { CompositeLogger } from "./CompositeLogger";
import { ConsoleLogger } from "./ConsoleLogger";
import { FileLogger } from "./FileLogger";
import { MockLogger } from "./MockLogger";

class LoggerSingleton implements Logger {
  private static instance: LoggerSingleton;
  private compositeLogger: CompositeLogger;
  private consoleLogger: ConsoleLogger;
  private fullLogFileLogger: Logger;
  private errorLogFileLogger: Logger;

  private constructor() {
    // Skip file logging in test environment
    if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
      this.consoleLogger = new ConsoleLogger([LogLevel.ERROR]); // Only show errors in tests
      this.fullLogFileLogger = new MockLogger();
      this.errorLogFileLogger = new MockLogger();
    } else {
      const dateTimeString = new Date().toISOString().replace(/[:.]/g, "-");

      this.consoleLogger = new ConsoleLogger([
        LogLevel.ERROR,
        LogLevel.WARN,
        LogLevel.INFO,
      ]);
      this.fullLogFileLogger = new FileLogger(
        `logs/${dateTimeString}/full-log.log`
      );
      this.errorLogFileLogger = new FileLogger(
        `logs/${dateTimeString}/errors-log.log`,
        [LogLevel.ERROR, LogLevel.WARN]
      );
    }

    this.compositeLogger = new CompositeLogger([
      this.consoleLogger,
      this.fullLogFileLogger,
      this.errorLogFileLogger,
    ]);
  }

  public static getInstance(): LoggerSingleton {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new LoggerSingleton();
    }
    return LoggerSingleton.instance;
  }

  public setConsoleLogLevel(levels: LogLevel[]): void {
    this.consoleLogger = new ConsoleLogger(levels);
    this.updateCompositeLogger();
  }

  private updateCompositeLogger(): void {
    this.compositeLogger = new CompositeLogger([
      this.consoleLogger,
      this.fullLogFileLogger,
      this.errorLogFileLogger,
    ]);
  }

  // Logger interface implementation
  error(message: string, ...args: unknown[]): void {
    this.compositeLogger.error(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.compositeLogger.warn(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.compositeLogger.info(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.compositeLogger.debug(message, ...args);
  }

  setLogLevels(levels: LogLevel[]): void {
    this.compositeLogger.setLogLevels(levels);
  }
}

export { LoggerSingleton };
