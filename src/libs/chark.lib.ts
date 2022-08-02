// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');
export enum LogLevel {
  Info,
  Warning,
  Danger,
}

export class CharkLib {
  static async log(message: string, type: LogLevel): Promise<void> {
    switch (type) {
      case LogLevel.Info:
        console.log(chalk.blue(message));
        break;
      case LogLevel.Warning:
        console.log(chalk.yellow(message));
        break;
      case LogLevel.Danger:
        console.log(chalk.red(message));
        break;
    }
  }

  static async logInfo(message: string): Promise<void> {
    await CharkLib.log(message, LogLevel.Info);
  }

  static async logWarning(message: string): Promise<void> {
    await CharkLib.log(message, LogLevel.Warning);
  }

  static async logDanger(message: string): Promise<void> {
    await CharkLib.log(message, LogLevel.Danger);
  }
}
