# Custom order function
A custom order can be achieved by passing in a compare function. You can do anything in the function but let us use sorting by the order of an array as an example:

```js
import postcss from 'postcss';
import cssDeclarationSorter from 'css-declaration-sorter';

const myOrder = ['margin', 'border', 'padding'];

const myCompareFunction = (a, b) => myOrder.indexOf(a) - myOrder.indexOf(b);

postcss([cssDeclarationSorter({ order: myCompareFunction })])
  .process('a { padding: 0; border: 0; margin: 0; }')
  .then(result =>
    console.log(result.css === 'a { margin: 0; border: 0; padding: 0; }')
  );
```
