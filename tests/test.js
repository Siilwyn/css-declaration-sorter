'use strict';

var tape = require('tape');
var postcss = require('postcss');
var plugin = require('../src/');
var name = require('../package.json').name;

var processCss = function (css, options) {
  return postcss(plugin(options)).process(css);
};

var testCssFixtures = function (testMessage, tests) {
  tape(testMessage, function (t) {
    // Set amount of assertions by setting two assertions per sort order test
    t.plan(tests.length * 2);

    tests.forEach(function (test) {
      var options = test.options || {};

      processCss(test.fixture, options).then(function (result) {
        t.equal(result.css, test.expected, test.message);
        t.equal(result.warnings().length, 0);
      });
    });
  });
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
  },
  {
    message: 'Sort according to Concentric CSS.',
    fixture: 'a{border: 0;flex: 0;}',
    expected: 'a{flex: 0;border: 0;}',
    options: { order: 'concentric-css' }
  }
];

var commentOrderTests = [
  {
    message: 'Keep comment intact.',
    fixture: 'a{flex: 0;/*flex*/}',
    expected: 'a{flex: 0;/*flex*/}'
  },
  {
    message: 'Keep dangling comment intact.',
    fixture: 'a{flex: 0;\n/*end*/}',
    expected: 'a{flex: 0;\n/*end*/}'
  },
  {
    message: 'Keep multiple comments intact.',
    fixture: 'a{flex: 0;\n/*flex*/\n/*flex 2*/}',
    expected: 'a{flex: 0;\n/*flex*/\n/*flex 2*/}'
  },
  {
    message: 'Keep newline comment above declaration.',
    fixture: 'a{flex: 0;\n/*border*/\nborder: 0;}',
    expected: 'a{\n/*border*/\nborder: 0;flex: 0;}'
  },
  {
    message: 'Keep inline comment beside declaration.',
    fixture: 'a{flex: 0;\nborder: 0; /*border*/}',
    expected: 'a{\nborder: 0; /*border*/flex: 0;}'
  }
];

var nestedDeclarationTests = [
  {
    message: 'Sort nested declarations.',
    fixture: 'a{a{flex: 0;border: 0;}}',
    expected: 'a{a{border: 0;flex: 0;}}',
  },
  {
    message: 'Sort nested at-rule declarations.',
    fixture: 'a{@media(){flex: 0;border: 0;}}',
    expected: 'a{@media(){border: 0;flex: 0;}}'
  }
];

testCssFixtures('Should order CSS declarations.', sortOrderTests);

testCssFixtures('Should retain comments.', commentOrderTests);

testCssFixtures('Should order nested CSS declarations.', nestedDeclarationTests);

tape('Should use the PostCSS plugin API.', function (t) {
  t.plan(2);

  t.ok(plugin().postcssVersion, 'Able to access version.');
  t.equal(plugin().postcssPlugin, name, 'Able to access name.');
});
