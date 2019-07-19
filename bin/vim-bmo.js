#!/usr/bin/env node

'use strict';

var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);

if (majorVer < 8) {
  console.error('Node version ' + ver + ' is not supported, please use Node.js 8.0 or higher.');
  process.exit(1);
} else {
  process.env.VIM_BMO_CLI = __filename;
  var cli = require('../lib/cli');
  cli.default().catch(function(error) {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
