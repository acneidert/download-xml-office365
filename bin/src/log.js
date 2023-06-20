const clc = require("cli-color");
const dayjs = require("dayjs");

const LEVELS = {
  ERROR: 81,
  WARN: 71,
  INFO: 61,
  DEBUG: 51,
};

const LEVELS_INVERSE = {
  81: "ERROR",
  71: "WARN",
  61: "INFO",
  51: "DEBUG",
};

const LEVELS_COLORS = {
  ERROR: (msg) => clc.bgRed.white(msg),
  WARN:  (msg) => clc.bgYellow.black(msg),
  INFO:  (msg) => clc.bgCyan.white(msg),
  DEBUG: (msg) => clc.bgMagenta.white(msg),
};

const OPTS = {
  NONE: 90,
  ERROR: 80,
  ALERT: 70,
  INFO: 60,
  DEBUG: 50,
};

function log(msg, level = LEVELS.INFO) {
  const LOG_LEVEL = OPTS[process.env.LOG_LEVEL] || OPTS.NONE;
  if (level > LOG_LEVEL) {
    const LEVEL_NAME = LEVELS_INVERSE[level];
    const msg_log = `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}][${LEVEL_NAME}] ${msg} `
    console.log(LEVELS_COLORS[LEVEL_NAME](msg_log));
  }
}

module.exports = {
  log,
  LEVELS,
};
