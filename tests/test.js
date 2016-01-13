'use strict';

var test = require('tape');
var postcss = require('postcss');
var plugin = require('../src/');
var name = require('../package.json').name;

var processTest = function (css, options) {
  return postcss(plugin(options)).process(css);
};

var sortOrderTests = [
  {
    message: 'Keep same order for identical properties.',
    fixture: 'a{flex: 0;flex: 2;}',
    expected: 'a{flex: 0;flex: 2;}'
  },
  {
    message: 'Sort alphabetically with no order defined.',
    fixture: 'a{flex: 0;border: 0;}',
    expected: 'a{border: 0;flex: 0;}'
  },
  {
    message: 'Sort alphabetically with a defined order.',
    fixture: 'a{flex: 0;border: 0;}',
    expected: 'a{border: 0;flex: 0;}',
    options: { order: 'alphabetically' }
  },
  {
    message: 'Sort according to custom order.',
    fixture: 'a{border: 0;z-index: 0;}',
    expected: 'a{z-index: 0;border: 0;}',
    options: { customOrder: 'tests/custom-order.json' }
  },
  {
    message: 'Sort according to SMACSS.',
    fixture: 'a{border: 0;flex: 0;}',
    expected: 'a{flex: 0;border: 0;}',
    options: { order: 'smacss' }
  }
];

test('Should order CSS declarations.', function (t) {
  // Set amount of assertions by setting two assertions per sort order test
  t.plan(sortOrderTests.length * 2);

  sortOrderTests.forEach(function (test) {
    var options = test.options || {};

    processTest(test.fixture, options).then(function (result) {
      t.equal(result.css, test.expected, test.message);
      t.equal(result.warnings().length, 0);
    });
  });
});

test('Should use the PostCSS plugin API.', function (t) {
  t.plan(2);

  t.ok(plugin().postcssVersion, 'Able to access version.');
  t.equal(plugin().postcssPlugin, name, 'Able to access name.');
});
