'use strict';

const https = require('https');
const fs = require('fs');

const isStandardProperty = function (tags) {
  return (
    tags.find(function (tagName) {
      return tagName.match(/css property/i);
    }) &&
    !tags.find(function (tagName) {
      return tagName.match(/non-standard/i);
    }) &&
    !tags.find(function (tagName) {
      return tagName.match(/deprecated/i);
    })
  );
};

const options = {
  hostname: 'developer.mozilla.org',
  port: 443,
  path: '/en-US/docs/Web/CSS$children?expand'
};

const request = https.get(options, function (result) {
  let data = '';

  result.setEncoding('utf8');

  result.on('data', function (chunk) {
    data += chunk;
  });

  // Write a filtered array of CSS property names to a JSON file
  result.on('end', function () {
    data = JSON.parse(data);

    let cssProperties = data.subpages.reduce(function (cssProperties, page) {
      // Add page title if tagged as CSS property and not tagged as Non-standard
      if (isStandardProperty(page.tags)) {
        cssProperties.push(page.title);
      }

      const cssDescriptors = page.subpages.reduce(function (cssDescriptors, subPage) {
        if (isStandardProperty(subPage.tags) && !~cssProperties.indexOf(subPage.title)) {
          cssDescriptors.push(subPage.title);
        }

        return cssDescriptors;
      }, []);

      return [].concat(cssProperties, cssDescriptors);
    }, []);

    cssProperties.sort();
    cssProperties = JSON.stringify(cssProperties, null, 2);

    fs.writeFile('orders/source.json', cssProperties, function (error) {
      if (error) throw error;
    });
  });
});

request.on('error', function (error) {
  console.error(error);
});
