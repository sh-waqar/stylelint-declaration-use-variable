var assign = require('object-assign');
var stylelint = require('stylelint');

var ruleName = 'declaration-use-variable';

var messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: 'Use scss variable for z-index.',
});

function checkCond(decl, opt) {
    // Regex for checking 
    // scss variable starting with '$'
    // map-get function in scss
    var regEx = /^(\$)|(map-get)/g;
    return decl.prop === opt && !regEx.test(decl.value);
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
            if (checkCond(statement, options)) {
                stylelint.utils.report({
                    ruleName: ruleName,
                    result: result,
                    node: statement,
                    message: messages.rejected
                });
            }
        });
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
