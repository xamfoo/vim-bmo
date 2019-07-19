#!/usr/bin/env node

import { startForeground } from '.';

startForeground(JSON.parse(process.argv[2]))
  .then(({ host, port }) => {
    if (process.send) {
      process.send({ host, port });
    }
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
