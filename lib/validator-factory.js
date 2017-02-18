var utils = require('./utils');

var nativeUndefined;
var nativeNull = null;
var nativeArray = Array;
var nativeObject = Object;
var nativeNumber = Number;
var nativeBoolean = Boolean;
var nativeString = String;
var nativeDate = Date;
var nativeFunction = Function;
var nativeRegExp = RegExp;

function isNative(schema) {
    return schema === nativeNull ||
        schema === nativeUndefined ||
        schema === nativeNumber ||
        schema === nativeString ||
        schema === nativeBoolean ||
        schema === nativeArray  ||
        schema === nativeObject ||
        schema === nativeDate ||
        schema === nativeRegExp ||
        schema === nativeFunction;
}

function nativeValidator(schema, thing) {
    if (schema === nativeNull) {
        return utils.isNull(thing);
    } else if (schema === nativeUndefined) {
        return utils.isUndefined(thing);
    } else if (schema === nativeNumber) {
        return utils.isNumber(thing);
    } else if (schema === nativeString) {
        return utils.isString(thing);
    } else if (schema === nativeBoolean) {
        return utils.isBoolean(thing);
    } else if (schema === nativeArray) {
        return utils.isArray(thing);
    } else if (schema === nativeObject) {
        return utils.isObject(thing);
    } else if (schema === nativeDate) {
        return utils.isDate(thing);
    } else if (schema === nativeRegExp) {
        return utils.isRegExp(thing);
    } else if (schema === nativeFunction) {
        return utils.isFunction(thing);
    }
}

function functionValidator(schema, thing) {
    return thing instanceof schema || schema(thing) === true;
}

function arrayValidator(schema, thing) {
    if (!utils.isArray(thing) || schema.length !== thing.length) {
        return false;
    }
    return schema.every(function (sch, idx) {
        return validatorFactory(sch)(thing[idx]) === true;
    });
}

function objectValidator(schema, thing) {
    return utils.isObject(thing) && Object.keys(schema).every(function (key) {
        return validatorFactory(schema[key])(thing[key]) === true;
    });
}

function regexValidator(schema, thing) {
    return utils.isString(thing) && schema.test(thing);
}

function thingValidator(schema, thing) {
    return schema === thing;
}

function validatorFactory(schema) {
    if (isNative(schema)) {
        return nativeValidator.bind(null, schema);
    } else if (utils.isFunction(schema)) {
        return functionValidator.bind(null, schema);
    } else if (utils.isArray(schema)) {
        return arrayValidator.bind(null, schema);
    } else if (utils.isObject(schema)) {
        return objectValidator.bind(null, schema);
    } else if (utils.isRegExp(schema)) {
        return regexValidator.bind(null, schema);
    } else {
        return thingValidator.bind(null, schema);
    }
}

module.exports = validatorFactory;
