'use strict';

const fs = require('fs').promises;
const { css } = require('@mdn/browser-compat-data');

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
  .sort();

fs.writeFile(
  'orders/alphabetical.json',
  JSON.stringify(cssProperties, null, 2),
);
