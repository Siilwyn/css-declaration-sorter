# Contributing
To setup and test, follow these steps:

```sh
git clone https://github.com/Siilwyn/css-declaration-sorter.git
cd css-declaration-sorter
npm ci
npm test
```

## General Prerequisites
Node.js, [latest LTS is recommended](https://nodejs.org/en/about/releases/).

### Tips
1. Try out a change to this package in another project with `npm link`.

1. Tests are run with AVA, read [the docs](https://github.com/avajs/ava/), AVA provides a powerful CLI to run (specific) tests.

1. To add a new CSS property it first needs to be included in [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data).

## Git Commit Messages
Write the message in present tense beginning with an uppercase letter, structured like this:

```
<subject>
<BLANK LINE>
<body>
```

Example

```
Test if shorthand data properties are known

Closes #1
```
