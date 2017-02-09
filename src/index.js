'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const timsort = require('timsort').sort;

module.exports = postcss.plugin('css-declaration-sorter', function (options) {
  // Sort CSS declarations alphabetically or using the set sorting order
  const sortCssDecls = function (cssDecls, sortOrder) {
    if (sortOrder === 'alphabetically') {
      timsort(cssDecls, function (a, b) {
        if (a.prop !== b.prop) {
          return a.prop < b.prop ? -1 : 1;
        } else {
          return 0;
        }
      });
    } else {
      timsort(cssDecls, function (a, b) {
        const aIndex = sortOrder.indexOf(a.prop);
        const bIndex = sortOrder.indexOf(b.prop);

        if (aIndex !== bIndex) {
          return aIndex < bIndex ? -1 : 1;
        } else {
          return 0;
        }
      });
    }
  };

  // Return all comments in two types with the node they belong to
  const processComments = function (css) {
    const newline = [];
    const inline = [];

    css.walkComments(function (comment) {
      // Don't do anything to root comments or the last newline comment
      const lastNewlineNode = !comment.next() && ~comment.raws.before.indexOf('\n');

      if (comment.parent.type === 'root' || lastNewlineNode) {
        return;
      }

      if (~comment.raws.before.indexOf('\n')) {
        newline.unshift({
          'comment': comment,
          'pairedNode': comment.next()
        });
      } else {
        inline.push({
          'comment': comment,
          'pairedNode': comment.prev()
        });
      }

      comment.remove();
    });

    return {
      'newline': newline,
      'inline': inline
    };
  };

  const processCss = function (css, sortOrder) {
    const processedComments = processComments(css);

    // Traverse nodes with children and sort those children
    css.walk(function (rule) {
      const isRule = rule.type === 'rule' || rule.type === 'atrule';

      if (isRule && rule.nodes && rule.nodes.length > 1) {
        sortCssDecls(rule.nodes, sortOrder);
      }
    });

    // Add comments back to the nodes they are paired with
    processedComments.newline.forEach(function (element) {
      element.comment.remove();
      element.pairedNode.parent.insertBefore(element.pairedNode, element.comment);
    });

    processedComments.inline.forEach(function (element) {
      element.comment.remove();
      element.pairedNode.parent.insertAfter(element.pairedNode, element.comment);
    });
  };

  return function (css) {
    let sortOrderPath;

    options = options || {};

    // Use included sorting order if order is passed and not alphabetically
    if (options.order && options.order !== 'alphabetically') {
      sortOrderPath = path.join(__dirname, '../orders/', options.order) + '.json';
    } else if (options.customOrder) {
      sortOrderPath = options.customOrder;
    } else {
      // Fallback to the default sorting order
      return processCss(css, 'alphabetically');
    }

    // Load in the array containing the order from a JSON file
    return new Promise(function (resolve, reject) {
      fs.readFile(sortOrderPath, function (error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    }).then(function (data) {
      return processCss(css, JSON.parse(data));
    });
  };
});
