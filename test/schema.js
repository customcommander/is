const sinon = require('sinon');
const test = require('ava');
const is = require('../lib/is');

function macro(t, input) {
    let validate;
    let schema = input[0];
    let pass = input[1];
    let fail = input[2];

    t.plan((pass.length + fail.length) * 3);

    validate = is(schema);
    pass.forEach(val => t.true(validate(val)));
    fail.forEach(val => t.false(validate(val)));

    validate = is.ObjectOf(schema);
    pass.forEach(val => t.true(validate({x: val})));
    fail.forEach(val => t.false(validate({x: val})));

    validate = is.ArrayOf(schema);
    pass.forEach(val => t.true(validate([val])));
    fail.forEach(val => t.false(validate([val])));
}

test('schema `null`', macro, [null,
/** should pass **/[null],
/** should fail **/[undefined]
]);

test('schema `undefined`', macro, [undefined,
/** should pass **/[undefined],
/** should fail **/[null, '', false]
]);

test('schema `Number`', macro, [Number,
/** should pass **/[-10, 10, NaN, Infinity, -Infinity],
/** should fail **/['10', new Number(10)]
]);

test('schema `String`', macro, [String,
/** should pass **/['', 'foo', '  '],
/** should fail **/[10, new String('foo')]
]);

test('schema `Boolean`', macro, [Boolean,
/** should pass **/[true, false],
/** should fail **/[1, 0]
]);

test('schema `Array`', macro, [Array,
/** should pass **/[[], [1], [1, 2]],
/** should fail **/[{x: 1}]
]);

test('schema `Object`', macro, [Object,
/** should pass **/[{}, {x: 1}],
/** should fail **/[[], null]
]);

test('schema `Date`', macro, [Date,
/** should pass **/[new Date()],
/** should fail **/[{}, new Date('9999-99-99')]
]);

test('schema `RegExp`', macro, [RegExp,
/** should pass **/[/foo/, new RegExp('foo')],
/** should fail **/['foo']
]);

function noop() {
}

test('schema `Function`', macro, [Function,
/** should pass **/[noop],
/** should fail **/[{}]
]);

test('schema <regular expression>', macro, [/foo/,
/** should pass **/['xxxfooxxx'],
/** should fail **/[new String('foo'), ['xxxfooxxx'], 'xxxbarxxx', 10]
]);

function Foo() {
}

test('schema <constructor>', macro, [Foo,
/** should pass **/[new Foo()],
/** should fail **/[{}]
]);

function is10(thing) {
    return thing === 10;
}

test('schema <function>', macro, [is10,
/** should pass **/[10],
/** should fail **/[99]
]);

function truthy() {
    return 1;
}

test('schema <function> (should not return truthy)', macro, [truthy,
/** should pass **/[],
/** should fail **/[99]
]);

test('schema <function> (receives the value as its first parameter)', t => {
    let stub = sinon.stub().returns(true);
    let validate;

    validate = is(stub);
    validate('foo');
    t.true(stub.calledOnce);
    t.true(stub.calledWithExactly('foo'));

    stub.reset();

    validate = is.ArrayOf(stub);
    validate(['foo', 'bar']);
    t.true(stub.calledTwice);
    t.true(stub.calledWithExactly('foo'));
    t.true(stub.calledWithExactly('bar'));

    stub.reset();

    validate = is.ObjectOf(stub);
    validate({x: 'foo', y: 'bar', z: 'baz'});
    t.true(stub.calledThrice);
    t.true(stub.calledWithExactly('foo'));
    t.true(stub.calledWithExactly('bar'));
    t.true(stub.calledWithExactly('baz'));
});


test('schema <value>', macro, [10,
/** should pass **/[10],
/** should fail **/['10']
]);

test('schema <array>', macro, [[String, Number],
/** should pass **/[['john', 35]],
/** should fail **/[[], ['john'], [35], [35, 'john'], ['john', 35, 'foo']]
]);

test('schema <object>', macro, [{x: Number, y: String},
/** should pass **/[{x: 10, y: 'foo'}, {x: 10, y: 'foo', z: true}],
/** should fail **/[{}, {x: 10}, {x: 10, y: 20}]
]);
