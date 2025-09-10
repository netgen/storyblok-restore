import { LogLevel, type Logger } from "./Logger";

export class ConsoleLogger implements Logger {
  constructor(
    private levels: LogLevel[] = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
    ]
  ) {}

  error(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage("ERROR", message);
    console.error(formattedMessage, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage("WARN", message);
      console.warn(formattedMessage, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage("", message);
      console.log(formattedMessage, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage("DEBUG", message);
      console.log(formattedMessage, ...args);
    }
  }

  setLogLevels(levels: LogLevel[]): void {
    this.levels = levels;
  }

  private formatMessage(level: string, message: string): string {
    const formattedPrefix = level.length > 0 ? `[${level}] ` : "";

    // If message starts with \n, put the newlines before the [LEVEL] prefix
    if (message.startsWith("\n")) {
      // Find the first non-newline character
      let i = 0;
      while (i < message.length && message[i] === "\n") {
        i++;
      }
      const newlines = message.slice(0, i);
      const content = message.slice(i);
      return `${newlines}${formattedPrefix}${content}`;
    }

    return `${formattedPrefix}${message}`;
  }
}
