'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const timsort = require('timsort').sort;

function compareDifferentType (a, b) {
  return (a.type === 'decl') ? -1 : (b.type === 'decl') ? 1 : 0;
}

function comparator (a, b) {
  return a === b ? 0 : a < b ? -1 : 1;
}

// Sort CSS declarations alphabetically or using the set sorting order
function sortCssDecls (cssDecls, sortOrder, propsPosition) {
  const propsPositionSign = propsPosition === 'top' ? 1 :
                            propsPosition === 'bottom' ? -1 : 1;
  if (sortOrder === 'alphabetically') {
    timsort(cssDecls, function (a, b) {
      if (a.type === b.type && a.type === 'decl') {
        return comparator(a.prop, b.prop);
      } else {
        return propsPositionSign * compareDifferentType(a, b);
      }
    });
  } else {
    timsort(cssDecls, function (a, b) {
      if (a.type === b.type && a.type === 'decl') {
        const aIndex = sortOrder.indexOf(a.prop);
        const bIndex = sortOrder.indexOf(b.prop);
        return comparator(aIndex, bIndex);
      } else {
        return propsPositionSign * compareDifferentType(a, b);
      }
    });
  }
}

function processCss (css, sortOrder, propsPosition) {
  const comments = [];
  const rulesCache = [];

  css.walk(function (node) {
    const nodes = node.nodes;
    const type = node.type;

    if (type === 'comment') {
      // Don't do anything to root comments or the last newline comment
      const isNewlineNode = ~node.raws.before.indexOf('\n');
      const lastNewlineNode = isNewlineNode && !node.next();
      const onlyNode = !node.prev() && !node.next();

      if (lastNewlineNode || onlyNode) {
        return;
      }

      if (isNewlineNode) {
        const pairedNode = node.next() ? node.next() : node.prev().prev();
        if (pairedNode) {
          comments.unshift({
            'comment': node,
            'pairedNode': pairedNode,
            'insertPosition': node.next() ? 'Before' : 'After',
          });
          node.remove();
        }
      } else {
        const pairedNode = node.prev() ? node.prev() : node.next().next();
        if (pairedNode) {
          comments.push({
            'comment': node,
            'pairedNode': pairedNode,
            'insertPosition': 'After',
          });
          node.remove();
        }
      }
      return;
    }

    // Add rule-like nodes to a cache so that we can remove all
    // comment nodes before we start sorting.
    const isRule = type === 'rule' || type === 'atrule';
    if (isRule && nodes && nodes.length > 1) {
      rulesCache.push(nodes);
    }
  });

  // Perform a sort once all comment nodes are removed
  rulesCache.forEach(function (nodes) {
    sortCssDecls(nodes, sortOrder, propsPosition);
  });

  // Add comments back to the nodes they are paired with
  comments.forEach(function (node) {
    const pairedNode = node.pairedNode;
    node.comment.remove();
    pairedNode.parent['insert' + node.insertPosition](pairedNode, node.comment);
  });
}

module.exports = postcss.plugin('css-declaration-sorter', function (options) {
  return function (css) {
    let sortOrderPath;

    options = options || {};

    const position = options.position || 'top';

    // Use included sorting order if order is passed and not alphabetically
    if (options.order && options.order !== 'alphabetically') {
      sortOrderPath = path.join(__dirname, '../orders/', options.order) + '.json';
    } else if (options.customOrder) {
      sortOrderPath = options.customOrder;
    } else {
      // Fallback to the default sorting order
      return processCss(css, 'alphabetically', position);
    }

    // Load in the array containing the order from a JSON file
    return new Promise(function (resolve, reject) {
      fs.readFile(sortOrderPath, function (error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    }).then(function (data) {
      return processCss(css, JSON.parse(data), position);
    });
  };
});
