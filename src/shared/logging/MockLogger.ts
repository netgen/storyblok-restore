import type { Logger } from "./Logger";

/**
 * Mock logger that does nothing - useful for tests
 */
export class MockLogger implements Logger {
  error(_message: string, ..._args: unknown[]): void {
    // Do nothing
  }

  warn(_message: string, ..._args: unknown[]): void {
    // Do nothing
  }

  info(_message: string, ..._args: unknown[]): void {
    // Do nothing
  }

  debug(_message: string, ..._args: unknown[]): void {
    // Do nothing
  }

  setLogLevels(_levels: unknown[]): void {
    // Do nothing
  }
}
