import fs from 'fs';
import path from 'path';
import test from 'ava';
import shorthandData from './shorthand-data.mjs';

const cssOrdersDir = './orders/';
const sourceProperties = JSON.parse(
  // eslint-disable-next-line no-sync
  fs.readFileSync(path.join(cssOrdersDir, 'alphabetical.json'))
);

test.cb('CSS properties are up-to-date.', (t) => {
  fs.readdir(cssOrdersDir, (error, files) => {
    files
      .filter((fileName) => fileName !== 'alphabetical.json')
      // Pair filenames and amount of properties from each CSS order file
      .map((fileName) => ({
        fileName: fileName,
        properties: JSON.parse(
          // eslint-disable-next-line no-sync
          fs.readFileSync(path.join(cssOrdersDir, fileName))
        ),
      }))
      .forEach((customOrderFile) => {
        t.deepEqual(
          customOrderFile.properties.sort(),
          sourceProperties.sort(),
          `${customOrderFile.fileName} has the same properties as source.`
        );
      });

    t.end();
  });
});

test('Shorthand data matches known CSS properties', (t) => {
  Object.keys(shorthandData).map((property) =>
    t.true(sourceProperties.includes(property), `${property} not found.`)
  );

  Object.values(shorthandData).flat().map((property) => (
    t.true(sourceProperties.includes(property), `${property} not found.`)
  ));
});
