import fs from 'node:fs/promises';

const { css } = await fs.readFile(
  new URL(import.meta.resolve('@mdn/browser-compat-data')),
)
  .then(JSON.parse);

const isStandardProperty = (name) => (property) => (
  Boolean(
    property.__compat?.status.standard_track === true &&
    property.__compat?.status.experimental === false &&
    property.__compat?.status.deprecated === false &&
    (
      property.__compat?.mdn_url &&
      !property.__compat?.mdn_url.includes('Guide') &&
      [...property.__compat.mdn_url.split('/')].pop() === name
    ),
  )
);

const excludedProperties = ['WOFF'];
const stabilizedProperties = [
  'font-stretch',
  'font-synthesis-position',
  'font-variant',
];

const scrapedProperties = Object.entries({
  ...css.properties,
  ...css['at-rules']['font-face'],
})
  .filter(([name]) => !excludedProperties.includes(name))
  .filter(([name, data]) => (
    isStandardProperty(name)(data) ||
    Object.values(data).some(isStandardProperty(name))
  ))
  .map(([name]) => name);

const cssProperties = [...scrapedProperties, ...stabilizedProperties]
  .sort((nameA, nameB) => (
    nameA === 'all' ? -1 : nameA.localeCompare(nameB)
  ));

fs.writeFile(
  'src/orders/alphabetical.mjs',
  `export const properties = ${
    JSON.stringify(cssProperties, null, 2).replaceAll('"', "'")
  };\n`,
);
