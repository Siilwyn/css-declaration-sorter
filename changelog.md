# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [7.3.0] - 2025-09-18
### Added
- New sorting order: Frakto, thanks to @danybranding!
- New CSS properties related to: animation & scroll timeline, text trim & wrapping.

## [7.2.0] - 2024-03-25
### Added
- New properties related to: offset, transition and text wrapping.
### Fixed
- Gap properties `column-gap` and `row-gap` moving unsafely.

## [7.1.1] - 2023-10-01
### Fixed
- Regression with TypeScript types resolution for CommonJS.

## [7.1.0] - 2023-09-23
### Added
- New font and math related properties.
### Fixed
- Keep unknown properties in the same position to prevent overrides.

## [7.0.3] - 2023-07-27
### Fixed
- TypeScript types resolution for Node.js 16 and up, thanks to @amiller-gh and @privatenumber!

## [7.0.2] - 2023-07-08
### Fixed
- Missing bubble sort code in npm package.

## [7.0.0] - 2023-05-29
### Fixed
- Border properties `border-end` and `border-start` radius moving unsafely.
### Removed
- Node.js 12 support.

## [6.4.1] - 2023-07-08
### Fixed
- Backport: Missing bubble sort code in npm package.

## [6.4.0] - 2023-03-23
### Added
- New container, overflow and font related properties.
### Fixed
- Order of shorthand properties between overrides that are already changing position with `keepOverrides`.

## [6.3.1] - 2022-09-02
### Fixed
- Logical border properties moving with `keepOverrides`.

## [6.3.0] - 2022-06-09
### Added
- New properties: `content-visibility` and `image-orientation`.
### Fixed
- Logical properties like `padding-block` moved unsafely with `keepOverrides`.

## [6.2.2] - 2022-03-27
### Fixed
- Types export for CommonJS.
- Expected plugin type, now using PostCSS `PluginCreator` type.

## [6.2.1] - 2022-03-26
### Fixed
- Include types in npm package files.

## [6.2.0] - 2022-03-26
### Added
- TypesScript types, special thanks to @peterblazejewicz.
- Named exports.
- New properties regarding font hyphens, print color and scrollbar gutter.
### Fixed
- Dynamic imports in CommonJS output.
### Changed
- No more dependencies, smaller ESM package.

## [6.1.4] - 2022-01-08
### Fixed
- Crash on missing paired comment node from invalid SCSS parsing.

## [6.1.3] - 2021-09-06
### Fixed
- Crash on missing node raws before content.

## [6.1.2] - 2021-09-06
### Fixed
- Crash on two comments in the same line.

## [6.1.1] - 2021-07-24
### Fixed
- Usage of built-in orders with CommonJS.

## [6.1.0] - 2021-07-24
### Changed
- Internal code to load built-in orders using dynamic import instead of using Node.js `fs`. Enables usage in other environments such as the browser.
### Added
- New properties regarding mask border, forced color adjustment & font styling overrides.

## [6.0.3] - 2021-05-11
### Fixed
- Sorting padding and border shorthands with `keepOverrides` enabled.
- Property reset with `all`, the property is moved to the top.
### Changed
- Add back Node.js 10 support.

## [6.0.2] - 2020-11-04
### Fixed
- Loading built-in order using a relative path.

## [6.0.1] - 2020-10-26
### Added
- ES module export type, both CommonJS and ES module importing are supported.
- Newer font and grid CSS properties like `row-gap` and `font-display`.
### Changed
- Scraping of CSS properties now comes from MDN browser compatibility package.
- PostCSS upgraded to version eight which changes PostCSS to a peer dependency.
- Order declarations to be ordered in the precendece of their shorthand counterparts. Special thanks to @DiemenDesign.
### Removed
- Node.js 10 support.

## [5.1.2] - 2020-02-21
### Fixed
- Experimental Node.js warning from showing up on some versions.

## [5.1.1] - 2020-02-07
### Fixed
- Handling vendor prefixed declarations such as `-moz-animation` when sorting with `keepOverrides` enabled.

## [5.1.0] - 2020-02-06
### Changed
- Sorting of unknown properties when sorting alphabetically now works the same as the other orders. Instead of sorting all properties only known properties will be sorted and unknown properties will retain their respective order.

## [5.0.0] - 2019-12-16
### Added
- Option `keepOverrides` to keep overrides in place, useful for legacy CSS where shorthand declarations override longhand declarations.

### Changed
- Default sorting order renamed to `alphabetical`.
- Custom sorting order as a JSON file replaced in favor of the option to pass a custom sorting function.

### Removed
- Node.js 6 and 8 support.

## [4.0.1] - 2018-07-30
### Fixed
- Invalid package engines node version range.

## [4.0.0] - 2018-07-24
### Added
- New flex box shorthand properties which can conflict with existing flex box properties.
- New ruby, transform and text related properties.

### Removed
- Node.js 4 support.
- Deprecated grid properties.

## [3.0.1] - 2018-01-11
### Fixed
- Keep at-rules at the same position.

## [3.0.0] - 2017-12-14
### Added
- Flexbox justify self properties.

### Changed
- SMACSS order so it is more in line with Stylelint.

### Removed
- Command line interface in favor of [postcss-cli](https://github.com/postcss/postcss-cli).

## [2.1.0] - 2017-08-25
### Added
- New text style and interaction related properties.

## [2.0.1] - 2017-06-19
### Fixed
- Prevent comments outside CSS selectors from being moved.

## [2.0.0] - 2017-03-16
### Changed
- Put declarations before nested declarations.

[7.3.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.2.0...v7.3.0
[7.2.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.1.1...v7.2.0
[7.1.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.1.0...v7.1.1
[7.1.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.0.3...v7.1.0
[7.0.3]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.0.2...v7.0.3
[7.0.2]: https://github.com/Siilwyn/css-declaration-sorter/compare/v7.0.0...v7.0.2
[7.0.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.4.1...v7.0.0
[6.4.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.4.0...v6.4.1
[6.4.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.3.1...v6.4.0
[6.3.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.3.0...v6.3.1
[6.3.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.2.2...v6.3.0
[6.2.2]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.2.1...v6.2.2
[6.2.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.2.0...v6.2.1
[6.2.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.1.4...v6.2.0
[6.1.4]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.1.3...v6.1.4
[6.1.3]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.1.2...v6.1.3
[6.1.2]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.1.1...v6.1.2
[6.1.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.1.0...v6.1.1
[6.1.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.0.3...v6.1.0
[6.0.3]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.0.2...v6.0.3
[6.0.2]: https://github.com/Siilwyn/css-declaration-sorter/compare/v6.0.1...v6.0.2
[6.0.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v5.1.2...v6.0.1
[5.1.2]: https://github.com/Siilwyn/css-declaration-sorter/compare/v5.1.1...v5.1.2
[5.1.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v5.1.0...v5.1.1
[5.1.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v4.0.1...v5.0.0
[4.0.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v3.0.1...v4.0.0
[3.0.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/Siilwyn/css-declaration-sorter/compare/v2.0.1...v2.0.0
[2.0.0]: https://github.com/Siilwyn/css-declaration-sorter/compare/v1.7.1...v2.0.0
