#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('key', 'Manage your API key --http://fourtytwowords.herokuapp.com/')
  .command('word', 'Show word details')
  .parse(process.argv);
