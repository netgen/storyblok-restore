import { LoggerSingleton } from "./LoggerSingleton";
import { LogLevel, type Logger } from "./Logger";
export { LogLevel, type Logger };
export { MockLogger } from "./MockLogger";

// Export the singleton instance as the default logger
export const logger: Logger = LoggerSingleton.getInstance();

// Convenience functions for changing log levels
export const setConsoleLogLevel = (levels: LogLevel[]): void => {
  LoggerSingleton.getInstance().setConsoleLogLevel(levels);
};
