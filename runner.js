#!/usr/bin/env node

/*
 * Copyright 2021 Yufan You
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

const { execSync } = require('child_process');
const { program } = require('commander');
const { version } = require('./package.json');

program.version(version)
  .requiredOption('-j, --judger <judger>', 'Executable judger program')
  .requiredOption('-b, --bot <bots...>', 'Executable bot programs')
  .option('-i, --initdata <initdata>', 'Stringified JSON initdata (optional)', "")
  .parse();

const { judger, bot } = program.opts();
let initdata = JSON.parse(program.opts().initdata);

const log = [];
const requests = Array.from(Array(bot.length), () => []);
const responses = Array.from(Array(bot.length), () => []);
const data = Array(bot.length);
const globaldata = Array(bot.length);

for (let round = 0; ; ++round) {
  const output = JSON.parse(execSync(judger, { input: JSON.stringify({ log, initdata }) }));
  const { command, content, display } = output;
  if (round === 0 && output.initdata !== void (0)) initdata = output.initdata;
  console.log(display);
  log.push({ output });
  if (command === 'finish') {
    console.log('----- FINISHED -----');
    console.log(content);
    break;
  } else if (command !== 'request') {
    console.error(`Invalid command: ${command}`);
    break;
  }

  const res = {};
  for (const [player, request] of Object.entries(content)) {
    requests[player].push(request);
    const input = JSON.stringify({
      requests: requests[player],
      responses: responses[player],
      data: data[player],
      globaldata: globaldata[player]
    });
    const botOutput = JSON.parse(execSync(bot[player], { input }));
    data[player] = botOutput.data;
    globaldata[player] = botOutput.globaldata;
    res[player] = { verdict: "OK", response: botOutput.response };
    responses[player].push(botOutput.response);
  }
  log.push(res);
}
