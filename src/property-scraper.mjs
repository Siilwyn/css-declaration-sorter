import { promises as fs } from 'fs';
import browserCompatData from '@mdn/browser-compat-data';

const { css } = browserCompatData;

const isStandardProperty = (name) => (property) => Boolean(
  property.__compat?.status.standard_track === true &&
  property.__compat?.status.experimental === false &&
  property.__compat?.status.deprecated === false &&
  (
    property.__compat?.mdn_url &&
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
  'orders/alphabetical.mjs',
  `export const properties = ${JSON.stringify(cssProperties, null, 2)}\n`,
);
