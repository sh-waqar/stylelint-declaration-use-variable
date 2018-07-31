var ruleTester = require('stylelint-test-rule-tape');
var declarationUseVariable = require('..');

var messages = declarationUseVariable.messages;

// Test for excluding non-matching properties
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: "/color/",

  accept: [
    {code: '.foo { color: $blue; }'},
    {code: '.foo { z-index: 22; }'},
    {code: '$color-white: #fff; \n.manage-link {\npadding: 0;\ntext-align: center;\nbackground-color: $abc;\nz-index: $foo;\na {\ncolor: $abc;\n&:hover {\ncolor: $red;\n}\n}\n}'}
  ],

  reject: [
    {
      code: '.foo { background-color: #fff; }',
      message: messages.expectedPresent('background-color', '$color-white')
    },
    {
      code: '.foo { color: #fcfcf; }',
      message: messages.expected('color')
    }
  ]
});

// Test for z-index variables
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: "z-index",

  accept: [
    {code: '.foo { z-index: $4; }'},
    {code: '.foo { z-index: map-get($map, $val); }'}
  ],

  reject: [
    {
      code: '.foo { z-index: 22; }',
      message: messages.expected('z-index')
    }
  ]
});

// Test for multiple values in array including regex
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: [['/color/', 'font-size', 'z-index']],

  accept: [
    {code: '.foo { color: $blue; }'},
    {code: '.foo { z-index: $foo; }'},
    {code: '.foo { color: map-get($map, $val); }'},
    {code: '.foo { background-color: map-get($map, $val); }'}
  ],

  reject: [
    {
      code: '.foo { color: blue; }',
      message: messages.expected('color')
    },
    {
      code: '.foo { z-index: 11; }',
      message: messages.expected('z-index')
    }
  ]
});

// Test for less, custom properties and color functions
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: [['/color/', 'font-size', 'z-index']],

  accept: [
    {code: '.foo { color: @blue; }'},
    {code: '.foo { z-index: --foo; }'},
    {code: '.foo { color: var(--var-name); }'},
    {code: '.foo { color: color($blue shade(10%)); }'}
  ],

  reject: [
    {
      code: '.foo { color: blue; }',
      message: messages.expected('color')
    },
    {
      code: '.foo { z-index: 11; }',
      message: messages.expected('z-index')
    }
  ]
});

// Test for ignoreValues by string
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: [['/color/', 'font-size', 'z-index', { ignoreValues: ['transparent'] }]],

  accept: [
    {code: '.foo { color: @blue; }'},
    {code: '.foo { z-index: --foo; }'},
    {code: '.foo { color: var(--var-name); }'},
    {code: '.foo { color: color($blue shade(10%)); }'},
    {code: '.foo { color: transparent }'}
  ],

  reject: [
    {
      code: '.foo { color: blue; }',
      message: messages.expected('color')
    },
    {
      code: '.foo { z-index: 11; }',
      message: messages.expected('z-index')
    },
    {
      code: '.foo { color: inherit; }',
      message: messages.expected('color')
    }
  ]
});

// Test for ignoreValues by regexp
ruleTester(declarationUseVariable.rule, {
  ruleName: declarationUseVariable.ruleName,
  config: [['/color/', 'font-size', 'z-index', { ignoreValues: ['/transparent|inherit/'] }]],

  accept: [
    {code: '.foo { color: @blue; }'},
    {code: '.foo { z-index: --foo; }'},
    {code: '.foo { color: var(--var-name); }'},
    {code: '.foo { color: color($blue shade(10%)); }'},
    {code: '.foo { color: transparent }'},
    {code: '.foo { color: inherit }'},
  ],

  reject: [
    {
      code: '.foo { color: blue; }',
      message: messages.expected('color')
    },
    {
      code: '.foo { z-index: 11; }',
      message: messages.expected('z-index')
    }
  ]
});
