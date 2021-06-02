#!/usr/bin/env node
// This is the main entry point for the ditto-cli command.
const { program } = require('commander');
// to use V8's code cache to speed up instantiation time
require('v8-compile-cache');

const { init, needsInit } = require('../lib/init/init');
const pull = require('../lib/pull');
const selectProject = require('../lib/select-project');

/**
 * Catch and report unexpected error.
 * @param {any} error The thrown error object.
 * @returns {void}
 */
function quit() {
  console.log('\nExiting Ditto CLI...');
  process.exitCode = 2;
  process.exit();
}

const setupCommands = () => {
  program.name('ditto-cli');
  program
    .command('pull')
    .description('Sync copy from Ditto into working directory')
    .action(() => checkInit('pull'));
    
  const projectDescription = 'Add a Ditto project to sync copy from'
  const projectCommand = program
    .command('project')
    .description(projectDescription)
    .action(() => checkInit('project'));

  projectCommand
    .command('add')
    .description(projectDescription)
    .action(() => checkInit('project'));
    
  projectCommand
    .command('remove')
    // TODO: write better description
    .description('Remove a Ditto project that copy is currently synced from')
    .action(() => checkInit('project remove'));
};

const checkInit = async (command) => {
  if (needsInit()) {
    try {
      await init();
      if (command === 'pull') {
        main(); // re-run to actually pull text now that init is finished
      }
    } catch (error) {
      quit();
    }
  } else {
    switch (command) {
      case 'pull':
        pull();
        break;
      case 'project':
        selectProject();
        break;
      case 'project remove':
        // TODO: implement me
        console.error(`Error: 'project remove' has not been implemented`);
        break;
      case 'none':
        setupCommands();
        program.help();
        break;
      default:
        quit();
    }
  }
};

const main = async () => {
  if (process.argv.length <= 2 && process.argv[1].includes('ditto-cli')) {
    await checkInit('none');
  } else {
    setupCommands();
  }
  program.parse(process.argv);
};

main();
