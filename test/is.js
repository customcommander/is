const test = require('ava');
const is = require('../lib/is');

test('is(): is a function', t => {
    t.is(typeof is, 'function');
});

test('is(): returns a function', t => {
    t.is(typeof is(Number) === 'function', true);
});

test('is(): throws an error if called without a schema', t => {
    t.plan(1);

    try {
        is();
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('is(): allows multiple schema to be combined', t => {
    let validate = is(Number, String, RegExp);
    t.is(validate(10), true);
    t.is(validate('foo'), true);
    t.is(validate(/foo/), true);
    t.is(validate([10]), false);
});


test('is.ArrayOf(): is a function', t => {
    t.is(typeof is.ArrayOf === 'function', true);
});

test('is.ArrayOf(): returns a function', t => {
    t.is(typeof is.ArrayOf(String) === 'function', true);
});

test('is.ArrayOf(): throws an error when called without a schema', t => {
    t.plan(1);

    try {
        is.ArrayOf();
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('is.ArrayOf(): all elements must comply', t => {
    let validate = is.ArrayOf(Number);
    t.is(validate([1]), true);
    t.is(validate([1, 2]), true);
    t.is(validate([1, 2, 3]), true);
    t.is(validate([1, '2', 3]), false);
});

test('is.ArrayOf(): works with multiple schemas', t => {
    let validate = is.ArrayOf(Number, String);
    t.is(validate([1, 2, 3]), true);
    t.is(validate(['a', 'b', 'c']), true);
    t.is(validate(['a', 2, 'c']), true);
    t.is(validate(['a', false, 'c']), false);
});

test('is.ArrayOf(): ok for empty array', t => {
    let validate;

    validate = is.ArrayOf(Number);
    t.is(validate([]), true);

    validate = is.ArrayOf(Number, String);
    t.is(validate([]), true);
});

test('is.ArrayOf(): not ok if not an array', t => {
    let validate = is.ArrayOf(Number);
    t.is(validate({}), false);
});

test('is.ObjectOf(): is a function', t => {
    t.is(typeof is.ObjectOf === 'function', true);
});

test('is.ObjectOf(): returns a function', t => {
    let validate = is.ObjectOf(Number);
    t.is(typeof validate === 'function', true);
});

test('is.ObjectOf(): throws an error when called without a schema', t => {
    t.plan(1);

    try {
        is.ObjectOf();
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('is.ObjectOf(): can combine multiple schemas', t => {
    let validate = is.ObjectOf(Number, String);
    t.is(validate({x: 1, y: 'foo'}), true);
    t.is(validate({x: 1}), true);
    t.is(validate({y: 'foo'}), true);
    t.is(validate({x: 'foo', y: 'bar'}), true);
    t.is(validate({x: true}), false);
});

test('is.ObjectOf(): ok for empty object', t => {
    let validate = is.ObjectOf(Number);
    t.is(validate({}), true);
});

test('is.ObjectOf(): not ok if not an object', t => {
    let validate = is.ObjectOf(Number);
    t.is(validate(null), false);
    t.is(validate([]), false);
});

test('is.ObjectOf(): ok if each property validate against the schema', t => {
    let validate = is.ObjectOf(Number);
    t.is(validate({x: 1}), true);
    t.is(validate({x: 1, y: 2}), true);
    t.is(validate({x: 1, y: 2, z: 3}), true);
});

test('is.ObjectOf(): not ok if at least one property does not validate against the schema', t => {
    let validate = is.ObjectOf(Number);
    t.is(validate({x: 1, y: '2'}), false);
});
