const { createLogger, format, transports } = require('winston');
const { consoleFormat } = require('winston-console-format');

const transportConsole = new transports.Console({
  format: format.combine(
    format.colorize({ all: true }),
    format.padLevels(),
    consoleFormat({
      showMeta: true,
      metaStrip: ["timestamp", "service"],
      inspectOptions: {
        depth: Infinity,
        colors: true,
        maxArrayLength: Infinity,
        breakLength: 120,
        compact: Infinity,
      },
    })
  ),
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "node-rdm6300" },
  transports: [
    transportConsole,
  ],
});

export default logger;