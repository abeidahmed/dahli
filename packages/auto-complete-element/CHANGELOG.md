# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2022-06-12

### Added
- Reset selections all at once using `data-autocomplete-reset` attribute on an element - [#21](https://github.com/abeidahmed/dahli/pull/21)

### Fixed
- `aria-activedescendant` is empty when opening the list initially - [#20](https://github.com/abeidahmed/dahli/pull/20)
- `aria-multiselectable` was set on unfocusable element and hence screen readers wasn't announcing it - [#20](https://github.com/abeidahmed/dahli/pull/20)
- Input not emitting `change` event when modified
- List not opening on `input` click - [#21](https://github.com/abeidahmed/dahli/pull/21)
- List not resetting after selecting an option (multiple) - [#22](https://github.com/abeidahmed/dahli/pull/22)
- Input loses focus after selecting an option - [#22](https://github.com/abeidahmed/dahli/pull/22)
- List not closing when clicking browser's console - [#22](https://github.com/abeidahmed/dahli/pull/22)

## [0.2.0] - 2022-06-01

### Added
- Add support for multiple selections - [#10](https://github.com/abeidahmed/dahli/pull/10)
- Add `data-empty` attribute when search results is empty - [#10](https://github.com/abeidahmed/dahli/pull/10)
- Add `debounce` on input filter - [#10](https://github.com/abeidahmed/dahli/pull/10)

### Fixed
- Clicking on list option closes the list container without selection - [#12](https://github.com/abeidahmed/dahli/pull/12)

## [0.1.1] - 2022-05-30

### Fixed
- Repository url
- Use `publishConfig` option instead of defining a script

### Added
- Bugs url
- Homepage url

## [0.1.0] - 2022-05-29

### Added
- Everything!
