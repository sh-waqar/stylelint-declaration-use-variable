var ruleTester = require('stylelint-rule-tester');
var declarationUseVariable = require('..');

var messages = declarationUseVariable.messages;
var testRule = ruleTester(declarationUseVariable.rule, declarationUseVariable.ruleName);

testRule('z-index', function(tr) {

  tr.ok('foo { z-index: $4;}');
  tr.notOk('foo { z-index: 22;}', messages.rejected);
});


testRule('color', function(tr) {

  tr.ok('foo { color: map-get;}');
  // tr.notOk('foo { color: blue;}', messages.rejected);
});



function basics(tr) {

}
