var utils = require('./utils');
var validatorFactory = require('./validator-factory');

function is() {
    var schemas = Array.prototype.slice.call(arguments);

    if (!schemas.length) {
        throw new Error('error: you must provide at least one schema');
    }

    return function validate(thing) {
        return this.some(function (schema) {
            return validatorFactory(schema)(thing) === true;
        });
    }.bind(schemas);
}

is.ArrayOf = function () {
    var validator = is.apply(null, arguments);
    return function validateArray(arr) {
        return utils.isArray(arr) && arr.every(function (elt) {
            return validator(elt) === true;
        });
    };
};

is.ObjectOf = function () {
    var validator = is.apply(null, arguments);
    return function validateObject(obj) {
        return utils.isObject(obj) && Object.keys(obj).every(function (key) {
            return validator(obj[key]) === true;
        });
    };
};

module.exports = is;
