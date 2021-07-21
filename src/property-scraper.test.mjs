import { promises as fs } from 'fs';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import shorthandData from './shorthand-data.mjs';
import { properties as sourceProperties } from '../orders/alphabetical.mjs';

const cssOrdersDir = './orders/';

test('CSS properties are up-to-date.', () => (
  fs.readdir(cssOrdersDir).then(async (files) => {
    const customOrderFiles = await Promise.all(files
      .filter((fileName) => fileName !== 'alphabetical.mjs')
      // Pair filenames and amount of properties from each CSS order file
      .map(async (fileName) => ({
        fileName: fileName,
        properties: (await import(`../${cssOrdersDir}/${fileName}`)).properties,
      })));

    return customOrderFiles.forEach((customOrderFile) => {
      assert.equal(
        customOrderFile.properties.sort(),
        sourceProperties.sort(),
        `${customOrderFile.fileName} has the same properties as source.`
      );
    });
  })
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
