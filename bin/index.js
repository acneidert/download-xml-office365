#!/usr/bin/env node

// read in env settings
require("dotenv").config();
const { CronJob } = require("cron");
const auth = require("./auth");
const { getMail } = require("./src/getMails");
const { log, LEVELS } = require("./src/log");

log('Registrado Cron de Download de Xml A cada Minuto', LEVELS.INFO);
const job = new CronJob("*/1 * * * *", async () => {
  try {
    log('Executando JOB.....', LEVELS.DEBUG);
    const authResponse = await auth.getToken(auth.tokenRequest);
    getMail(authResponse.accessToken);
    log('Tarefa Finalizada.....', LEVELS.DEBUG);
  } catch (error) {
    log('Erro Ao Processar JOB', LEVELS.ERROR);    
  }
});

job.start();

async function test() {
  const authResponse = await auth.getToken(auth.tokenRequest);
  getMail(authResponse.accessToken);
}

// test();

