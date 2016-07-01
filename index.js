var assign = require('object-assign');
var stylelint = require('stylelint');

var ruleName = 'sh-waqar/declaration-use-variable';

var messages = stylelint.utils.ruleMessages(ruleName, {
    expected: function expected(h) {
        return 'Expected variable for \"' + h + '\".';
    }
});

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

    return regEx.test(val);
}

/**
 * Checks the defined property in (css|scss|less) with the
 * test string or regex defined in stylelint config
 * 
 * @param  {string} value
 * @param  {string|regex} comparison
 * @return {bool}
 */
function testAgaintString(value, comparison) {
    var comparisonIsRegex = comparison[0] === "/" && comparison[comparison.length - 1] === "/";

    if (comparisonIsRegex) {
        var valueMatches = new RegExp(comparison.slice(1, -1)).test(value);
        return valueMatches;
    }

    return value == comparison;
}

/**
 * Checks the test expression with css declaration
 * 
 * @param  {string} value
 * @param  {string|array} comparison
 * @return {bool}
 */
function checkProp(value, comparison) {
    if (Array.isArray(comparison)) {
        for (var input of comparison) {
            if (testAgaintString(value, input)) return true;
        }
        return false;
    } else {
        return testAgaintString(value, comparison);
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
            if (checkProp(statement.prop, options) && !checkValue(statement.value)) {
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
