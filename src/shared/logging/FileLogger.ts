import type { Logger } from "./Logger";
import { LogLevel } from "./Logger";
import { promises as fs } from "fs";
import { dirname } from "path";

export class FileLogger implements Logger {
  constructor(
    private filePath: string,
    private levels: LogLevel[] = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
    ]
  ) {}

  error(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.ERROR)) {
      this.writeToFile("ERROR", message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.WARN)) {
      this.writeToFile("WARN", message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.INFO)) {
      this.writeToFile("INFO", message, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.levels.includes(LogLevel.DEBUG)) {
      this.writeToFile("DEBUG", message, ...args);
    }
  }

  setLogLevels(levels: LogLevel[]): void {
    this.levels = levels;
  }

  private async writeToFile(
    level: string,
    message: string,
    ...args: unknown[]
  ): Promise<void> {
    try {
      // Ensure directory exists
      await fs.mkdir(dirname(this.filePath), { recursive: true });

      const timestamp = new Date().toISOString();
      const formattedMessage = this.formatMessage(level, message);
      const argsString =
        args.length > 0
          ? ` ${args.map((arg) => JSON.stringify(arg)).join(" ")}`
          : "";
      const logEntry = `${timestamp} [${level}] ${formattedMessage}${argsString}\n`;

      await fs.appendFile(this.filePath, logEntry);
    } catch (error) {
      // Fallback to console if file writing fails
      console.error(`Failed to write to log file ${this.filePath}:`, error);
    }
  }

  private formatMessage(_level: string, message: string): string {
    // If message starts with \n, put the newlines before the [LEVEL] prefix
    if (message.startsWith("\n")) {
      // Find the first non-newline character
      let i = 0;
      while (i < message.length && message[i] === "\n") {
        i++;
      }
      const newlines = message.slice(0, i);
      const content = message.slice(i);
      return `${newlines}${content}`;
    }

    return message;
  }
}
