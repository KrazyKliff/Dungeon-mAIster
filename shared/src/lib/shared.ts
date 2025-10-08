export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;
  
  static setLevel(level: LogLevel) {
    this.level = level;
  }
  
  static debug(message: string, ...args: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  static info(message: string, ...args: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  static warn(message: string, ...args: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  static error(message: string, ...args: any[]) {
    if (this.level <= LogLevel.ERROR) {
      const formattedArgs = args.map(arg => {
        if (arg instanceof Error) {
          return arg.message; // Extract message from Error objects
        } else if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg); // Stringify other objects
        } else {
          return arg; // Return as is for primitives
        }
      });
      console.error(`[ERROR] ${message}`, ...formattedArgs);
    }
  }
  
  static setLevelFromString(level: string) {
    switch (level.toLowerCase()) {
      case 'debug':
        this.setLevel(LogLevel.DEBUG);
        break;
      case 'info':
        this.setLevel(LogLevel.INFO);
        break;
      case 'warn':
        this.setLevel(LogLevel.WARN);
        break;
      case 'error':
        this.setLevel(LogLevel.ERROR);
        break;
      default:
        this.setLevel(LogLevel.INFO);
    }
  }
}
