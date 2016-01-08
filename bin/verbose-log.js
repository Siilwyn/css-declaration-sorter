'use strict';

var args = require('argh').argv;

module.exports = function () {
  if (args.verbose) {
    console.log.apply(this, arguments);
  }
};
