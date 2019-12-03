'use strict';

const { readFile } = require('fs').promises;
const path = require('path');

const postcss = require('postcss');
const timsort = require('timsort').sort;

const builtInOrders = [
  'alphabetical',
  'concentric-css',
  'smacss',
];

module.exports = postcss.plugin(
  'css-declaration-sorter',
  ({ order = 'alphabetical' } = {}) => css => {
    if (typeof order === 'function')
      return processCss({ css, comparator: order });

    if (!builtInOrders.includes(order))
      return Promise.reject(
        Error([
          `Invalid built-in order '${order}' provided.`,
          `Available built-in orders are: ${builtInOrders}`,
        ].join('\n'))
      );

    if (order === 'alphabetical')
      return Promise.resolve(processCss({ css, order }));

    // Load in the array containing the order from a JSON file
    return readFile(path.join(__dirname, '..', 'orders', order) + '.json')
      .then(data => processCss({ css, order: JSON.parse(data) }));
  }
);

function processCss ({ css, order, comparator }) {
  const comments = [];
  const rulesCache = [];

  css.walk(node => {
    const nodes = node.nodes;
    const type = node.type;

    if (type === 'comment') {
      // Don't do anything to root comments or the last newline comment
      const isNewlineNode = node.raws.before && ~node.raws.before.indexOf('\n');
      const lastNewlineNode = isNewlineNode && !node.next();
      const onlyNode = !node.prev() && !node.next();

      if (lastNewlineNode || onlyNode || node.parent.type === 'root') {
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
  rulesCache.forEach(nodes => {
    sortCssDeclarations({ nodes, order, comparator });
  });

  // Add comments back to the nodes they are paired with
  comments.forEach(node => {
    const pairedNode = node.pairedNode;
    node.comment.remove();
    pairedNode.parent['insert' + node.insertPosition](pairedNode, node.comment);
  });
}

// Sort CSS declarations alphabetically or using the set sorting order
function sortCssDeclarations ({ nodes, order, comparator }) {
  if (order === 'alphabetical') {
    comparator = defaultComparator;
  }

  if (comparator) {
    timsort(nodes, (a, b) => {
      if (a.type === 'decl' && b.type === 'decl') {
        return comparator(a.prop, b.prop);
      } else {
        return compareDifferentType(a, b);
      }
    });
  }

  else {
    timsort(nodes, (a, b) => {
      if (a.type === 'decl' && b.type === 'decl') {
        const aIndex = order.indexOf(a.prop);
        const bIndex = order.indexOf(b.prop);
        return defaultComparator(aIndex, bIndex);
      } else {
        return compareDifferentType(a, b);
      }
    });
  }
}

function defaultComparator (a, b) {
  return a === b ? 0 : a < b ? -1 : 1;
}

function compareDifferentType (a, b) {
  if (b.type === 'atrule') {
    return 0;
  }

  return a.type === 'decl' ? -1 : b.type === 'decl' ? 1 : 0;
}
