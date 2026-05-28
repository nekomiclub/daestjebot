import conf from '../conf';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getUTC } from '../handlers/service';
import toBytes from '../utils/to-bytes';



const fileFormat = format.combine(
  format.timestamp({ format: () => `${getUTC().fulldate} ${getUTC().time}` }),
  format.errors({ stack: true }),
  format.printf(({ level, message, timestamp, ...etc }) => {
    const msg = `[${timestamp}] [${level.toUpperCase()}]\t${message}`;
    const stack = etc?.stack ? ` ${etc?.stack}` : '';

    return ''.concat(msg, stack);
  }),
);



const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp({ format: () => getUTC().time }),
        format.printf(({ level, message, timestamp, ...etc }) => {
          const msg = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
          const stack = etc?.stack ? ` ${etc?.stack}` : '';

          return ''.concat(msg, stack);
        }),
        format.colorize({ all: true, colors: { http: 'grey' } })
      )
    }),
    new DailyRotateFile({
      format: fileFormat,
      dirname: conf.variables.volumes.logs,
      zippedArchive: true,
      maxSize: toBytes('50mb'),
      datePattern: 'YYYY-MM-DD',
      createSymlink: true,

      level: 'debug',
      filename: 'app-%DATE%.log',
      maxFiles: '7d'
    })
  ],
});



class LoggerService {
  error(message: string, ...args: any[]) { logger.error(message, ...args); }
  warn(message: string, ...args: any[]) { logger.warn(message, ...args); }
  info(message: string, ...args: any[]) { logger.info(message, ...args); }
  http(message: string, ...args: any[]) { logger.http(message, ...args); }
  verbose(message: string, ...args: any[]) { logger.verbose(message, ...args); }
  debug(message: string, ...args: any[]) { logger.debug(message, ...args); }
  silly(message: string, ...args: any[]) { logger.silly(message, ...args); }
}

const Logger = new LoggerService();
export default Logger;