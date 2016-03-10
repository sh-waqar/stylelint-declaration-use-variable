var ruleTester = require('stylelint-rule-tester');
var declarationUseVariable = require('..');

var messages = declarationUseVariable.messages;
var testRule = ruleTester(declarationUseVariable.rule, declarationUseVariable.ruleName);

// Test for excluding non-matching properties
testRule('background-color', function(tr) {
    tr.ok('.foo { color: #000; }');
    tr.ok('.foo { z-index: 22; }');
    tr.notOk('.foo { background-color: #fff; }', messages.rejected);
});

// Test for z-index variables
testRule('z-index', function(tr) {
    tr.ok('.foo { z-index: $4; }');
    tr.ok('.foo { z-index: map-get($map, $val); }');
    tr.notOk('.foo { z-index: 22; }', messages.rejected);
});

// Test for color variables
testRule('color', function(tr) {
    tr.ok('.foo { color: $blue; }');
    tr.ok('.foo { color: map-get($map, $val); }');
    tr.notOk('.foo { color: blue; }', messages.rejected);
});
