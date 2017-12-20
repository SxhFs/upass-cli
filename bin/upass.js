#!/usr/bin/env node
let pkg = require('../package.json');

require('commander')
  .version(pkg.version)
  .usage('<command> [options]')
  .command('init', 'generate a new project from a template')
  .parse(process.argv)