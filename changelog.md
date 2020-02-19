# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
