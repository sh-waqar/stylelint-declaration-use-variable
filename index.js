var stylelint = require('stylelint');

var ruleName = 'sh-waqar/declaration-use-variable';

var messages = stylelint.utils.ruleMessages(ruleName, {
    expected: function expected(property) {
        return 'Expected variable for \"' + property + '\".';
    },
    expectedPresent: function expectedPresent(property, variable) {
        return 'Expected variable ' + variable + ' for \"' + property + '\".';
    }
});

// Store the variables in object
var variables = {};

/**
 * Compares the declaration with regex pattern
 * to verify the usage of variable
 *
 * @param  {string} val
 * @return {bool}
 */
function checkValue(val) {
    // Regex for checking
    // scss variable starting with '$'
    // map-get function in scss
    // less variable starting with '@'
    // custom properties starting with '--' or 'var'
    var regEx = /^(\$)|(map-get)|(\@)|(--)|(var)/g;

    // color functions starting with 'color('
    if (val.indexOf('color(') > -1) {
      return true;
    }
    return regEx.test(val);
}

/**
 * Checks the value and if its present in variables object
 * returns the respective variable
 * 
 * @param  {string}
 * @return {string|bool}
 */
function checkPresentVariable(val) {
    return variables[val] ? variables[val] : false;
}

/**
 * Checks the defined property in (css|scss|less) with the
 * test string or regex defined in stylelint config
 *
 * @param  {string} value
 * @param  {string|regex} comparison
 * @return {bool}
 */
function testAgaintString(prop, value, comparison) {
    var comparisonIsRegex = comparison[0] === "/" && comparison[comparison.length - 1] === "/";

    // if prop is a variable do not run check
    // and add it in the variables object for later check
    // and return, since it would be a variable declaration
    // not a style property declaration
    if (checkValue(prop)) {
        variables[value] = prop;
        return;
    }

    if (comparisonIsRegex) {
        var valueMatches = new RegExp(comparison.slice(1, -1)).test(prop);
        return valueMatches;
    }

    return prop == comparison;
}

/**
 * Checks the test expression with css declaration
 *
 * @param  {string} prop
 * @param  {string|array} comparison
 * @return {bool}
 */
function checkProp(prop, value, comparison) {
    if (Array.isArray(comparison)) {
        for (var input of comparison) {
            if (testAgaintString(prop, value, input)) return true;
        }
        return false;
    } else {
        return testAgaintString(prop, value, comparison);
    }
}

module.exports = stylelint.createPlugin(ruleName, function(options) {
    options = options || '';

    return function(root, result) {
        var validOptions = stylelint.utils.validateOptions({
            ruleName: ruleName,
            result: result,
            actual: options,
        });

        if (!validOptions) {
            return;
        }

        root.walkDecls(function(statement) {
            if (checkProp(statement.prop, statement.value, options)  && checkPresentVariable(statement.value) && !checkValue(statement.value)) {
                stylelint.utils.report({
                    ruleName: ruleName,
                    result: result,
                    node: statement,
                    message: messages.expectedPresent(statement.prop, checkPresentVariable(statement.value))
                });
            } else if (checkProp(statement.prop, statement.value, options) && !checkValue(statement.value)) {
                stylelint.utils.report({
                    ruleName: ruleName,
                    result: result,
                    node: statement,
                    message: messages.expected(statement.prop)
                });
            }

        });
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
