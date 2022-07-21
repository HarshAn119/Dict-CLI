const program = require('commander');
const key = require('../command/key');

program
  .command('set')
  .description('Set your API key --get at https://fourtytwowords.herokuapp.com')
  .action(key.set);

program.command('show').description('Show cuurent API key').action(key.show);

program
  .command('remove')
  .description('Remove current API key')
  .action(key.remove);

program.parse(process.argv);
