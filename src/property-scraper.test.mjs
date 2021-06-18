import { readFileSync } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import shorthandData from './shorthand-data.mjs';

const cssOrdersDir = './orders/';
const sourceProperties = JSON.parse(
  // eslint-disable-next-line no-sync
  readFileSync(path.join(cssOrdersDir, 'alphabetical.json'))
);

test('CSS properties are up-to-date.', () => (
  fs.readdir(cssOrdersDir).then((files) => (
    files
      .filter((fileName) => fileName !== 'alphabetical.json')
      // Pair filenames and amount of properties from each CSS order file
      .map((fileName) => ({
        fileName: fileName,
        properties: JSON.parse(
          // eslint-disable-next-line no-sync
          readFileSync(path.join(cssOrdersDir, fileName))
        ),
      }))
      .forEach((customOrderFile) => {
        assert.equal(
          customOrderFile.properties.sort(),
          sourceProperties.sort(),
          `${customOrderFile.fileName} has the same properties as source.`
        );
      })
  ))
));

test('Shorthand data matches known CSS properties', () => {
  Object.keys(shorthandData).map((property) =>
    assert.is(sourceProperties.includes(property), true, `${property} not found.`)
  );

  Object.values(shorthandData).flat().map((property) => (
    assert.is(sourceProperties.includes(property), true, `${property} not found.`)
  ));
});

test.run();
