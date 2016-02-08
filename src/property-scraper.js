'use strict';

var https = require('https');
var fs = require('fs');

var includes = function (element, searchValue) {
  return Boolean(~element.indexOf(searchValue));
};

var options = {
  hostname: 'developer.mozilla.org',
  port: 443,
  path: '/en-US/docs/Web/CSS$children?expand'
};

var request = https.get(options, function (result) {
  var data = '';
  var cssProperties = [];

  result.setEncoding('utf8');

  result.on('data', function (chunk) {
    data += chunk;
  });

  // Write a filtered array of CSS property names to a JSON file
  result.on('end', function () {
    data = JSON.parse(data);

    data.subpages.forEach(function (element) {
      // Add element if tagged as CSS property and not tagged as Non-standard
      if (includes(element.tags, 'CSS Property') && !includes(element.tags, 'Non-standard')) {
        cssProperties.push(element.title);
      }
    });

    cssProperties = JSON.stringify(cssProperties, null, 2);

    fs.writeFile('orders/source.json', cssProperties, function (error) {
      if (error) throw error;
    });
  });
});

request.on('error', function (error) {
  console.error(error);
});
