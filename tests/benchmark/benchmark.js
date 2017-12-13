'use strict';

const Benchmark = require('benchmark');

const fs = require('fs');
const postcss = require('postcss');
const cssDeclarationSorter = require('../../src/index.js');

// eslint-disable-next-line
const gumby = fs.readFileSync('./tests/benchmark/gumby.css');

const suite = new Benchmark.Suite;

const testSorter = function (deferred, sorter, css) {
  postcss([sorter()])
    .process(css)
    .then(function () {
      deferred.resolve();
    });
};

suite
  .add(
    'css-declaration-sorter',
    function (deferred) {
      testSorter(deferred, cssDeclarationSorter, gumby);
    },
    { 'defer': true }
  )
  .on('cycle', function (event) {
    console.log(String(event.target));
  });

suite.run({ 'async': true });
