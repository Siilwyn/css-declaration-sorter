#!/usr/bin/env node
'use strict';

const args = require('argh').argv;
const fs = require('fs');
const gatherStream = require('gather-stream');
const path = require('path');

const cssdeclsort = require('../src/index.js');
const log = require('./verbose-log');

const transform = function (input, output) {
  // Read from a file, fallback to stdin
  readFileStdin(input, function (error, data) {
    const options = {};

    if (error) throw error;

    options.from = input;
    options.to = output;
    options.order = args.order;
    options.customOrder = args.customOrder;

    log('Input:', input, 'Output:', output);

    cssdeclsort.process(data, options).then(function (result) {
      // Write to a file, fallback to stdout
      writeFileStdout(output, result.css);
    }).catch(function (error) {
      console.error(error.toString());
    });
  });
};

const handleArgs = function () {
  const directory = args.directory || '';
  const explicitOutput = args.output;
  let usageFile;

  log('Arguments:', args, '\n');

  // Log version from package.json and exit
  if (args.version || args.v) {
    console.log(require('../package.json').version);
    process.exit(0);
  }

  // Log help text for CLI usage from text file and exit
  if (args.help || args.h) {
    usageFile = path.join(__dirname, 'cli-usage.txt');

    fs.readFile(usageFile, function (error, data) {
      if (error) throw error;

      console.log('\n' + String(data));
      process.exit(0);
    });
  }

  // Loop through given arguments and process each argument
  if (args.argv) {
    args.argv.forEach(function (file) {
      const output = explicitOutput || path.join(directory, file);
      transform(file, output);
    });
  } else {
    // Read from stdin
    transform(null, explicitOutput);
  }
};

function readFileStdin (file, callback) {
  if ('function' == typeof file) callback = file, file = null;
  const stream = file ? fs.createReadStream(file) : process.stdin;
  stream.pipe(gatherStream(callback));
}

function writeFileStdout (file, contents) {
  if (1 === arguments.length) contents = file, file = null;
  // eslint-disable-next-line no-sync
  if (file) return fs.writeFileSync(file, contents);
  process.stdout.write(contents);
}

process.title = 'cssdeclsort';

handleArgs();
