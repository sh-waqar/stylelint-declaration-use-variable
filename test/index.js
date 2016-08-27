var ruleTester = require('stylelint-rule-tester');
var declarationUseVariable = require('..');

var messages = declarationUseVariable.messages;
var testRule = ruleTester(declarationUseVariable.rule, declarationUseVariable.ruleName);

// Test for excluding non-matching properties
testRule('/color/', function(tr) {
    tr.ok('.foo { color: $blue; }');
    tr.ok('.foo { z-index: 22; }');
    tr.ok('$color-white: #fff; \n.manage-link {\npadding: 0;\ntext-align: center;\nbackground-color: $abc;\nz-index: $foo;\na {\ncolor: $abc;\n&:hover {\ncolor: $red;\n}\n}\n}');
    tr.notOk('.foo { background-color: #fff; }', messages.expectedPresent('background-color', '$color-white'));
    tr.notOk('.foo { color: #fcfcf; }', messages.expected('color'));
});

// Test for z-index variables
testRule('z-index', function(tr) {
    tr.ok('.foo { z-index: $4; }');
    tr.ok('.foo { z-index: map-get($map, $val); }');
    tr.notOk('.foo { z-index: 22; }', messages.expected('z-index'));
});

// Test for multiple values in array including regex
testRule(['/color/', 'font-size', 'z-index'], function(tr) {
    tr.ok('.foo { color: $blue; }');
    tr.ok('.foo { z-index: $foo; }');
    tr.ok('.foo { color: map-get($map, $val); }');
    tr.ok('.foo { background-color: map-get($map, $val); }');
    tr.notOk('.foo { color: blue; }', messages.expected('color'));
    tr.notOk('.foo { z-index: 11; }', messages.expected('z-index'));
});

// Test for less, custom properties and color functions
testRule(['/color/', 'font-size', 'z-index'], function(tr) {
    tr.ok('.foo { color: @blue; }');
    tr.ok('.foo { z-index: --foo; }');
    tr.ok('.foo { color: var(--var-name); }');
    tr.ok('.foo { color: color($blue shade(10%)); }');
    tr.notOk('.foo { color: blue; }', messages.expected('color'));
    tr.notOk('.foo { z-index: 11; }', messages.expected('z-index'));
});
