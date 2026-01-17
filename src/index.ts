// types

type Color =
  | "DARK_RED"
  | "GRAY"
  | "RED"
  | "GREEN"
  | "YELLOW"
  | "BLUE"
  | "MAGENTA"
  | "CYAN"
  | "WHITE";

type LogLevel = "FATAL" | "INFO" | "WARN" | "ERROR" | "DEBUG" | "TRACE";
interface LogFormatterConfig {
  datetime: Date;
  level: LogLevel;
  name: string;
  requestId?: string;
}
type LogFormatter = (msg: string, config: LogFormatterConfig) => string;

interface LoggerConfig {
  name: string;
  logLevel: LogLevel;
  logFormatter?: LogFormatter;
  formatDate?: (date: Date) => string;
  requestId?: string;
  disableColors?: boolean;
}

// helper consts
const COLOR_CODES: Record<Color, number> = {
  DARK_RED: 31,
  GRAY: 90,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  WHITE: 37,
};
const LOG_LEVELS: Record<LogLevel, number> = {
  FATAL: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5,
};
const LOG_LEVEL_COLORS: Record<LogLevel, Color> = {
  FATAL: "DARK_RED",
  ERROR: "RED",
  WARN: "YELLOW",
  INFO: "GREEN",
  DEBUG: "CYAN",
  TRACE: "MAGENTA",
};

// core logger class

export class BasicLogger {
  private name: string;
  private logLevel: LogLevel;
  private logFormatter?: LogFormatter;
  private formatDate?: (date: Date) => string;
  private requestId?: string;
  private disableColors: boolean;

  constructor(config: LoggerConfig) {
    // validation
    if (typeof config.name !== "string") {
      throw new Error(`Invalid 'name' supplied.`);
    }
    if (!(config.logLevel in LOG_LEVELS)) {
      throw new Error(`Invalid 'logLevel' supplied.`);
    }
    if (
      config.logFormatter !== undefined &&
      typeof config.logFormatter !== "function"
    ) {
      throw new Error(
        `Invalid 'logFormatter', must be a function if supplied.`
      );
    }
    if (
      config.formatDate !== undefined &&
      typeof config.formatDate !== "function"
    ) {
      throw new Error(`Invalid 'formatDate', must be a function if supplied.`);
    }
    if (
      config.requestId !== undefined &&
      typeof config.requestId !== "string"
    ) {
      throw new Error(`Invalid 'requestId', must be a string if supplied.`);
    }
    if (
      config.disableColors !== undefined &&
      typeof config.disableColors !== "boolean"
    ) {
      throw new Error(
        `Invalid 'disableColors', must be a boolean if supplied.`
      );
    }

    // assignment
    this.name = config.name;
    this.logLevel = config.logLevel;
    this.logFormatter = config.logFormatter;
    this.formatDate = config.formatDate;
    this.requestId = config.requestId;
    this.disableColors = config.disableColors || false;
  }

  public fatal(msg: string) {
    this.__log("FATAL", msg);
  }

  public error(msg: string) {
    this.__log("ERROR", msg);
  }

  public warn(msg: string) {
    this.__log("WARN", msg);
  }

  public info(msg: string) {
    this.__log("INFO", msg);
  }

  public debug(msg: string) {
    this.__log("DEBUG", msg);
  }

  public trace(msg: string) {
    this.__log("TRACE", msg);
  }

  private __addColor(text: string, color: Color): string {
    if (this.disableColors) {
      return text;
    }
    return `\x1b[${COLOR_CODES[color]}m${text}\x1b[0m`;
  }

  private __formatDate(date: Date): string {
    if (this.formatDate === undefined) {
      return date.toISOString();
    } else {
      return this.formatDate(date);
    }
  }

  private __logFormatter(msg: string, config: LogFormatterConfig): string {
    if (this.logFormatter === undefined) {
      const datetime = this.__addColor(this.__formatDate(new Date()), "GRAY");
      const level = this.__addColor(
        config.level.padEnd(5, " "),
        LOG_LEVEL_COLORS[config.level]
      );
      const name = this.__addColor(this.name.padStart(10, " "), "BLUE");
      const requestId = this.__addColor(
        (config.requestId || "").padEnd(36, " "),
        "GRAY"
      );

      return `${datetime} ${level} ${requestId} ${name} : ${msg}`;
    } else {
      return this.logFormatter(msg, config);
    }
  }

  private __log(logLevel: LogLevel, msg: string) {
    // validation
    if (!(logLevel in LOG_LEVELS)) {
      throw new Error(`Invalid 'logLevel' supplied.`);
    }
    if (typeof msg !== "string") {
      throw new Error(`Invalid 'msg', must be a string.`);
    }

    // log
    if (LOG_LEVELS[this.logLevel] >= LOG_LEVELS[logLevel]) {
      console.log(
        this.__logFormatter(msg, {
          datetime: new Date(),
          level: logLevel,
          name: this.name,
          requestId: this.requestId,
        })
      );
    }
  }
}
