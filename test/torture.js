const test = require('ava');
const is = require('../lib/is');

test('schemas can be embedded', t => {
    let validate = is({
        a: Number,
        b: String,
        c: {
            d: Number,
            e: String,
            f: {
                g: Boolean,
                h: Boolean,
            }
        }
    });

    t.true(validate({
        a: 1,
        b: 'foo',
        c: {
            d: 2,
            e: 'bar',
            f: {
                g: true,
                h: false
            }
        }
    }));

    t.false(validate({
        a: 1,
        b: 'foo',
        c: {
            d: 2,
            e: 'bar',
            f: {
                g: true,
                h: 'baz' //<-- should be a boolean
            }
        }
    }));
});

test('`is([[[]]])` works!', t => {
    let validate = is([[[]]]);
    t.true(validate([[[]]]));
    t.false(validate([]));
    t.false(validate([[]]));
    t.false(validate([[[[]]]]));
    t.false(validate([[[1]]]));
});

test('can reuse is-generated validators', t => {
    let isPairOfNumbers = is([Number, Number]);
    let isObjectOfPairOfNumbers = is.ObjectOf(isPairOfNumbers);
    t.true(isObjectOfPairOfNumbers({}));
    t.true(isObjectOfPairOfNumbers({x: [10, 20]}));
    t.true(isObjectOfPairOfNumbers({x: [10, 20], y: [30, 40]}));
    t.false(isObjectOfPairOfNumbers({x: [10, 20], y: [30, '40']}));
});
