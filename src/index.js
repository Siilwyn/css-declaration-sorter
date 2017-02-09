'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const timsort = require('timsort').sort;

// Sort CSS declarations alphabetically or using the set sorting order
function sortCssDecls (cssDecls, sortOrder) {
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
}

function processCss (css, sortOrder) {
  const newline = [];
  const inline = [];
  const cached = [];

  css.walk(function (node) {
    const nodes = node.nodes;
    const type = node.type;

    if (type === 'comment') {
      // Don't do anything to root comments or the last newline comment
      const lastNewlineNode = !node.next() && ~node.raws.before.indexOf('\n');

      if (node.parent.type === 'root' || lastNewlineNode) {
        return;
      }

      if (~node.raws.before.indexOf('\n')) {
        newline.unshift({
          'comment': node,
          'pairedNode': node.next()
        });
      } else {
        inline.push({
          'comment': node,
          'pairedNode': node.prev()
        });
      }

      node.remove();
      return;
    }

    // Add rule-like nodes to a cache so that we can remove all
    // comment nodes before we start sorting.
    const isRule = type === 'rule' || type === 'atrule';
    if (isRule && nodes && nodes.length > 1) {
      cached.push(nodes);
    }
  });

  // Perform a sort once all comment nodes are removed
  cached.forEach(function (nodes) {
    sortCssDecls(nodes, sortOrder);
  });

  // Add comments back to the nodes they are paired with
  newline.forEach(function (element) {
    element.comment.remove();
    element.pairedNode.parent.insertBefore(element.pairedNode, element.comment);
  });

  inline.forEach(function (element) {
    element.comment.remove();
    element.pairedNode.parent.insertAfter(element.pairedNode, element.comment);
  });
}

module.exports = postcss.plugin('css-declaration-sorter', function (options) {
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
