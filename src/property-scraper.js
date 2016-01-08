'use strict';

var https = require('https');
var fs = require('fs');

var isProperty = function (element) {
  return element.type === 'Properties';
};

var getName = function (element) {
  return element.name;
};

var options = {
  hostname: 'docs.devdocs.io',
  port: 443,
  path: '/css/index.json'
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
    data = JSON.parse(data)
      .entries.filter(isProperty)
      .map(getName);

    cssProperties = JSON.stringify(data, null, 2);

    fs.writeFile('orders/source.json', cssProperties, function (error) {
      if (error) throw error;
    });
  });
});

request.on('error', function (error) {
  console.error(error);
});
