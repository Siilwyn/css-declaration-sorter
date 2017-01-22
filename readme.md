<img alt='CSS declaration sorter logo' src='https://cdn.rawgit.com/Siilwyn/css-declaration-sorter/master/logo.svg' height='260' align='right'>

# CSS Declaration Sorter

[![Greenkeeper badge](https://badges.greenkeeper.io/Siilwyn/css-declaration-sorter.svg)](https://greenkeeper.io/)
[![Travis Build Status][travis-icon]][travis]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

A Node.js module and [PostCSS] plugin to sort the CSS declarations inside each selector based on their property names. Leveraging PostCSS’s speed, this module can quickly sort all your styling for added neatness. On top of that sorted CSS is smaller when gzipped because there will be more similar strings. The intention of this module is to sort the source CSS code of a project in the build process. Check out [the Atom package](https://github.com/Siilwyn/css-declaration-sorter-atom) for individual usage.

## Alphabetical example
Input:
```css
body {
    display: block;
    animation: none;
    color: #C55;
    border: 0;
}
```

Output:
```css
body {
    animation: none;
    border: 0;
    color: #C55;
    display: block;
}
```

## Capabilities
- Up-to-date CSS properties from the [MDN Web Platform](https://developer.mozilla.org/).
- Sort using your own defined order.
- Sorting nested rules.
- Less and SCSS support when combined with either [postcss-scss](https://github.com/postcss/postcss-scss) or [postcss-less](https://github.com/webschik/postcss-less).
- Thought-out sorting orders out of the box, approved by their authors.

## Usage
`npm install css-declaration-sorter --save-dev`

### CLI
```
Usage: cssdeclsort [options] [input]
Sort CSS declarations from file(s) or stdin and output to file(s) or stdout.

Options:
  -h, --help        Display help text.
  -v, --version     Display cssdeclsort's version.
  --customOrder     Use provided JSON file data to order the declarations.
  --directory       Output to provided directory instead of current directory.
  --order           Use provided order instead of ordering alphabetically.
  --output          Output to a file instead of writing to the origin or stdout.
  --verbose         Log extra information about the process to the console.

Orders:
  alphabetically, smacss, concentric-css

```

Piping data and writing to a specific file:  
`perfectionist input.css | cssdeclsort --output output.css`

Sorting multiple files by overwriting:  
`cssdeclsort --order smacss *.css`

### Vanilla JS
```js
var fs = require('fs');
var postcss = require('postcss');
var cssdeclsort = require('css-declaration-sorter');

postcss([cssdeclsort({order: 'smacss'})])
  .process(fs.readFileSync('something.css'))
  .then(function (result) {
    fs.writeFileSync('something.css', result.css);
  });
```

### Gulp
```js
var gulp = require('gulp');
var gulpPostcss = require('gulp-postcss');
var cssdeclsort = require('css-declaration-sorter');

gulp.task('css', function () {
  return gulp.src('something.css')
    .pipe(gulpPostcss([cssdeclsort({order: 'smacss'})]))
    .pipe(gulp.dest('./'));
});
```
See [PostCSS] docs for more examples and other environments.

## Sorting orders
- Alphabetically  
*Ordering in a simple alphabetical manner from a - z.*

- [SMACSS](https://smacss.com/book/formatting#grouping)  
*Ordering from most important, flow affecting properties, to least important properties.*
  - Box
  - Border
  - Background
  - Text
  - Other

- [Concentric CSS](https://github.com/brandon-rhodes/Concentric-CSS)  
*Starts outside the box model, moves inward.*
  - Positioning
  - Visibility
  - Box model
  - Dimensions
  - Text

- Custom order  
*Provide your own order by passing an array in a JSON file.*

[PostCSS]: https://github.com/postcss/postcss
[travis]: https://travis-ci.org/Siilwyn/css-declaration-sorter
[travis-icon]: https://img.shields.io/travis/Siilwyn/css-declaration-sorter/master.svg?style=flat-square
[david]: https://david-dm.org/Siilwyn/css-declaration-sorter
[david-icon]: https://img.shields.io/david/Siilwyn/css-declaration-sorter.svg?style=flat-square
[david-dev]: https://david-dm.org/Siilwyn/css-declaration-sorter?type=dev
[david-dev-icon]: https://img.shields.io/david/dev/Siilwyn/css-declaration-sorter.svg?style=flat-square
