# With Gulp

```js
import gulp from 'gulp';
import gulpPostcss from 'gulp-postcss';
import { cssDeclarationSorter } from 'css-declaration-sorter';

gulp.task('css', function () {
  return gulp.src('some.css')
    .pipe(gulpPostcss([
      cssDeclarationSorter({ order: 'smacss' })
    ]))
    .pipe(gulp.dest('./'));
});
```
