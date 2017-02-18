function getClass(thing) {
    return Object.prototype.toString.call(thing);
}

function isUndefined(thing) {
    return typeof thing === 'undefined';
}

function isNull(thing) {
    return thing === null;
}

function isArray(thing) {
    return Array.isArray(thing);
}

function isObject(thing) {
    return getClass(thing) === '[object Object]';
}

function isNumber(thing) {
    return typeof thing === 'number';
}

function isBoolean(thing) {
    return typeof thing === 'boolean';
}

function isString(thing) {
    return typeof thing === 'string';
}

function isDate(thing) {
    return getClass(thing) === '[object Date]' && thing.toString() !== 'Invalid Date';
}

function isFunction(thing) {
    return typeof thing === 'function';
}

function isRegExp(thing) {
    return getClass(thing) === '[object RegExp]';
}

module.exports = {
    isUndefined: isUndefined,
    isNull: isNull,
    isArray: isArray,
    isObject: isObject,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isString: isString,
    isDate: isDate,
    isFunction: isFunction,
    isRegExp: isRegExp
};
