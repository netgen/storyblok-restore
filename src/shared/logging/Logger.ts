export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface Logger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export class ConsoleLogger implements Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  error(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage("ERROR", message);
    console.error(formattedMessage, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.WARN) {
      const formattedMessage = this.formatMessage("WARN", message);
      console.warn(formattedMessage, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.INFO) {
      const formattedMessage = this.formatMessage("", message);
      console.log(formattedMessage, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.DEBUG) {
      const formattedMessage = this.formatMessage("DEBUG", message);
      console.log(formattedMessage, ...args);
    }
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
