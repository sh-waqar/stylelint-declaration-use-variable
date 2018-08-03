# stylelint-declaration-use-variable

[![Build Status](https://travis-ci.org/sh-waqar/stylelint-declaration-use-variable.svg?branch=master)](https://travis-ci.org/sh-waqar/stylelint-declaration-use-variable)

A [stylelint](https://github.com/stylelint/stylelint) plugin that check the use of scss, less or custom css variable on declaration. Either used with '$', map-get(), '@' or 'var(--var-name)'.

## Installation

```
npm install stylelint-declaration-use-variable
```

Be warned: v0.2.0+ is only compatible with stylelint v3+. For earlier version of stylelint, use earlier versions of this.

## Usage

Add it to your stylelint config `plugins` array, then add `"declaration-use-variable"` to your rules,
specifying the property for which you want to check the usage of variable.

Like so:

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-declaration-use-variable"
  ],
  "rules": {
    // ...
    "sh-waqar/declaration-use-variable": "color",
    // ...
  }
}
```

#### Multiple properties

Multiple properties can be watched by passing them inside array. Regex can also be used inside arrays.

```js
// .stylelintrc
"rules": {
  // ...
  "sh-waqar/declaration-use-variable": [["/color/", "z-index", "font-size"]],
  // ...
}
```

#### Regex support

Passing a regex will watch the variable usage for all matching properties. This rule will match all CSS properties while ignoring Sass and Less variables.

```js
// .stylelintrc
"rules": {
  // ...
  "sh-waqar/declaration-use-variable": "/color/",
  // ...
}
```

#### Options

Passing `ignoreValues` option, you can accpet values which are exact same string or matched by Regex

```js
// .stylelintrc
"rules": {
  // ...
  "sh-waqar/declaration-use-variable": [["/color/", "font-size", { ignoreValues: ["transparent", "inherit", "/regexForspecialFunc/"] }]],
  // ...
}
```

## Details

Preprocessers like scss, less uses variables to make the code clean, maintainable and reusable. But since developers are lazy they might get a chance to miss the use of variables in styling code and that kinda sucks.

```scss
$some-cool-color: #efefef;

.foo {
    display: inline-block;
    text-align: center;
    color: #efefef; // Wait a min! there should be a variable.
}
```

### Supported scss variables

Scss variables using '$' notation and map-get are supported
```scss
// Simple variables
$some-cool-color: #efefef;
$some-integer: 123;
$some-pixels: 4px;

color: $some-cool-color;

// Using map-get
$cool-colors: (
    blue: #3ea1ec,
    red: #eb5745,
);

color: map-get($cool-colors, blue);

```

### Supported color functions

If you plan to level-up the usage of your variables by the usage of fancy [color-functions](https://github.com/postcss/postcss-color-function) - you can!

Instead of a direct variable usage like this:
```scss
$white: #fff;

.foo {
  color: $white;
}
```

You could also do things like:
```scss
.foo {
  color: color($white shade(10%));
}
```

This will still be seen as a valid code by the plugin. As a side-note, it doesn't matter what kind of variable-syntax
you are using in the color function itself - if the line starts with `color(` then it is seen as valid.

> If you contribute and wonder about the check for `color(` - it couldn't be done via regex because not only values will be passed to the plugin, but also property names. For some reason, the plugin just dies if you start extending the regex to look for "color". So it must be done via extra-if-check.
