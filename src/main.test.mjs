import test from 'ava';
import postcss from 'postcss';
import plugin from '../src/main.mjs';

const testCssFixtures = (testMessage, tests) => {
  test(testMessage, (t) => {
    // Set amount of assertions by setting two assertions per sort order test
    t.plan(tests.length * 2);

    return Promise.all(tests.map((test) => (
      postcss(plugin(test.options))
        .process(test.fixture, { from: undefined })
        .then((result) => {
          t.is(result.css, test.expected, test.message);
          t.is(result.warnings().length, 0);
        })
    )));
  });
};

const sortOrderTests = [
  {
    message: 'Keep same order for identical properties.',
    fixture: 'a{flex: 0;flex: 2;}',
    expected: 'a{flex: 0;flex: 2;}',
  },
  {
    message: 'Sort alphabetically with no order defined.',
    fixture: 'a{flex: 0;border: 0;}',
    expected: 'a{border: 0;flex: 0;}',
  },
  {
    message: 'Sort alphabetically with a defined order.',
    fixture: 'a{flex: 0;border: 0;}',
    expected: 'a{border: 0;flex: 0;}',
    options: { order: 'alphabetical' },
  },
  {
    message: 'Sort according to custom order, changed.',
    fixture: 'a{border: 0;z-index: 0;}',
    expected: 'a{z-index: 0;border: 0;}',
    options: { order: () => -1 },
  },
  {
    message: 'Sort according to custom order, retained.',
    fixture: 'a{border: 0;z-index: 0;}',
    expected: 'a{border: 0;z-index: 0;}',
    options: { order: () => 1 },
  },
  {
    message: 'Sort according to SMACSS.',
    fixture: 'a{border: 0;flex: 0;}',
    expected: 'a{flex: 0;border: 0;}',
    options: { order: 'smacss' },
  },
  {
    message: 'Sort according to Concentric CSS.',
    fixture: 'a{border: 0;flex: 0;}',
    expected: 'a{flex: 0;border: 0;}',
    options: { order: 'concentric-css' },
  },
  {
    message: 'Keep at-rule at the same position.',
    fixture: 'a{border: 0;@import sii;flex:0;}',
    expected: 'a{border: 0;@import sii;flex:0;}',
  },
  {
    message: 'Retain unkown properties',
    fixture: 'a{unkown-b: 0; unkown-a: 0;}',
    expected: 'a{unkown-b: 0; unkown-a: 0;}',
  },
];

const commentOrderTests = [
  {
    message: 'Keep comment intact.',
    fixture: 'a{flex: 0;/*flex*/}',
    expected: 'a{flex: 0;/*flex*/}',
  },
  {
    message: 'Keep root comments intact.',
    fixture: '/*a*/\na{}\n/*b*/\nb{}',
    expected: '/*a*/\na{}\n/*b*/\nb{}',
  },
  {
    message: 'Handle declaration with one comment.',
    fixture: 'a{/*comment*/}',
    expected: 'a{/*comment*/}',
  },
  {
    message: 'Keep dangling comment intact.',
    fixture: 'a{flex: 0;\n/*end*/}',
    expected: 'a{flex: 0;\n/*end*/}',
  },
  {
    message: 'Keep multiple comments intact.',
    fixture: 'a{flex: 0;\n/*flex*/\n/*flex 2*/}',
    expected: 'a{flex: 0;\n/*flex*/\n/*flex 2*/}',
  },
  {
    message: 'Keep newline comment above declaration.',
    fixture: 'a{flex: 0;\n/*border*/\nborder: 0;}',
    expected: 'a{\n/*border*/\nborder: 0;flex: 0;}',
  },
  {
    message: 'Handle multiple newline comments.',
    fixture: 'a{flex: 0;\n/*border a*/\n/*border b*/\nborder: 0;}',
    expected: 'a{\n/*border a*/\n/*border b*/\nborder: 0;flex: 0;}',
  },
  {
    message: 'Keep inline comment beside declaration.',
    fixture: 'a{flex: 0;\nborder: 0; /*border*/}',
    expected: 'a{\nborder: 0; /*border*/flex: 0;}',
  },
];

const nestedDeclarationTests = [
  {
    message: 'Sort nested declarations.',
    fixture: 'a{a{flex: 0;border: 0;}}',
    expected: 'a{a{border: 0;flex: 0;}}',
  },
  {
    message: 'Sort nested at-rule declarations.',
    fixture: 'a{@media(){flex: 0;border: 0;}}',
    expected: 'a{@media(){border: 0;flex: 0;}}',
  },
  {
    message: 'Keep nested newline comment above declaration.',
    fixture: 'a{&:hover{flex: 0;\n/*border*/\nborder: 0;}}',
    expected: 'a{&:hover{\n/*border*/\nborder: 0;flex: 0;}}',
  },
  {
    message: 'Keep nested inline comment beside declaration.',
    fixture: 'a{&:hover{flex: 0;\nborder: 0; /*border*/}}',
    expected: 'a{&:hover{\nborder: 0; /*border*/flex: 0;}}',
  },
  {
    message: 'Put declarations before nested selector.',
    fixture: 'a{margin: 0;&:hover{color: red;}padding: 0;}',
    expected: 'a{margin: 0;padding: 0;&:hover{color: red;}}',
  },
];

const keepOverridesTests = [
  {
    message: 'Keep shorthand overrides in place.',
    fixture: 'a{animation-name: hi;animation: hey 1s ease;}',
    expected: 'a{animation-name: hi;animation: hey 1s ease;}',
    options: { keepOverrides: true },
  },
  {
    message: 'Keep longhand overrides in place.',
    fixture: 'a{flex: 1;flex-grow: -1;}',
    expected: 'a{flex: 1;flex-grow: -1;}',
    options: { keepOverrides: true, order: () => -1 },
  },
  {
    message: 'Sort overrides with other declarations.',
    fixture: 'a{z-index: 1;animation: hey 1s ease;}',
    expected: 'a{animation: hey 1s ease;z-index: 1;}',
    options: { keepOverrides: true },
  },
  {
    message: 'Keep overrides in place mixed with declaration.',
    fixture: 'a{z-index: 1;animation: hey 1s ease;animation-name: hi;}',
    expected: 'a{animation: hey 1s ease;animation-name: hi;z-index: 1;}',
    options: { keepOverrides: true },
  },
  {
    message: 'Keep vendor prefixed declarations in place.',
    fixture: 'a{animation: a;-moz-animation:b;}',
    expected: 'a{animation: a;-moz-animation:b;}',
    options: { keepOverrides: true },
  },
  {
    message: 'Keep border declarations in place.',
    fixture: 'a{border-top: 1px solid;border-color: purple;}',
    expected:'a{border-top: 1px solid;border-color: purple;}',
    options: { keepOverrides: true },
  },
  {
    message: 'Keep padding declarations in place.',
    fixture: 'a{padding-left: unset;padding-inline-start: 0;}',
    expected:'a{padding-left: unset;padding-inline-start: 0;}',
    options: { keepOverrides: true },
  },
];

testCssFixtures('Should order declarations.', sortOrderTests);

testCssFixtures('Should retain comments.', commentOrderTests);

testCssFixtures('Should order nested declarations.', nestedDeclarationTests);

testCssFixtures('Should keep shorthand override order.', keepOverridesTests);

test('Should use the PostCSS plugin API.', (t) => {
  t.plan(1);

  t.is(plugin().postcssPlugin, 'css-declaration-sorter', 'Able to access name.');
});
