'use strict';

var fs = require('fs');
var path = require('path');

var postcss = require('postcss');
var sortArray = require('sort-array');

module.exports = postcss.plugin('css-declaration-sorter', function (options) {
  var sortCssDecls = function (css, sortOrder) {
    // Walk through CSS selectors
    css.walkRules(function (rules) {
      var cssDecls = [];

      // Walk through CSS declarations pushing each declaration into an array
      rules.walkDecls(function (decl) {
        cssDecls.push(decl);
      });

      // Sort using the set sorting order if it's not set to sort alphabetically
      if (sortOrder === 'alphabetically') {
        sortArray(cssDecls, 'prop');
      } else {
        sortArray(cssDecls, 'prop', {
          prop: sortOrder
        });
      }

      // Remove all CSS declarations from the CSS selector
      rules.removeAll();
      // Append sorted CSS declarations to the CSS selector
      rules.append(cssDecls);
    });
  };

  return function (css) {
    var sortOrderPath;

    options = options || {};

    // Use included sorting order if order is passed and not alphabetically
    if (options.order && options.order !== 'alphabetically') {
      sortOrderPath = path.join(__dirname, '../orders/', options.order) + '.json';
    } else if (options.customOrder) {
      sortOrderPath = options.customOrder;
    } else {
      // Fallback to the default sorting order
      return sortCssDecls(css, 'alphabetically');
    }

    // Load in the array containing the order from a JSON file
    return new Promise(function (resolve, reject) {
      fs.readFile(sortOrderPath, function (error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    }).then(function (data) {
      return sortCssDecls(css, JSON.parse(data));
    });
  };
});
