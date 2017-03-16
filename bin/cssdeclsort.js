#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const read = require('read-file-stdin');
const write = require('write-file-stdout');
const args = require('argh').argv;

const cssdeclsort = require('../src/index.js');
const log = require('./verbose-log');

const transform = function (input, output) {
  // Read from a file, fallback to stdin
  read(input, function (error, data) {
    const options = {};

    if (error) throw error;

    options.from = input;
    options.to = output;
    options.order = args.order;
    options.customOrder = args.customOrder;

    log('Input:', input, 'Output:', output);

    cssdeclsort.process(data, options).then(function (result) {
      // Write to a file, fallback to stdout
      write(output, result.css);
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

process.title = 'cssdeclsort';

handleArgs();
