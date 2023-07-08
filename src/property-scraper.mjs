import fs from 'node:fs/promises';

const { css } = await import.meta.resolve('@mdn/browser-compat-data')
  .then((moduleResolution) => new URL(moduleResolution).pathname)
  .then(fs.readFile)
  .then(JSON.parse);

const isStandardProperty = (name) => (property) => Boolean(
  property.__compat?.status.standard_track === true &&
  property.__compat?.status.experimental === false &&
  property.__compat?.status.deprecated === false &&
  (
    property.__compat?.mdn_url &&
    !property.__compat?.mdn_url.includes('Guide') &&
    [...property.__compat.mdn_url.split('/')].pop() === name
  ),
);

const cssProperties = Object.entries({ ...css.properties, ...css['at-rules']['font-face'] })
  .filter(([name, data]) =>
    isStandardProperty (name) (data) ||
    Object.values(data).some(isStandardProperty(name)),
  )
  .map(([name]) => name)
  .sort((nameA, nameB) => (
    nameA === 'all'
      ? -1
      : nameA.localeCompare(nameB)
  ));

fs.writeFile(
  'src/orders/alphabetical.mjs',
  `export const properties = ${JSON.stringify(cssProperties, null, 2)}\n`,
);
