// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Default value of maximum number of digits.
 * @type {number}
 */
const DEFAULT_MAX_DIGITS = 11;

/**
 * Error object for {@link DecimalNumberMatcher}
 * @typedef {Object} DecimalNumberMatcherError
 * @property {string} code - error code
 * @property {string} message - error message
 */

/**
 * Enum of errors for {@link DecimalNumberMatcher}
 * @readonly
 * @enum {DecimalNumberMatcherError}
 */
const Errors = {
  DOUBLE_NUMBER_E001: { code: "doubleNumber.e001", message: "The value is not a valid decimal number." },
  DOUBLE_NUMBER_E002: { code: "doubleNumber.e002", message: "The value exceeded maximum number of digits." },
  DOUBLE_NUMBER_E003: { code: "doubleNumber.e003", message: "The value exceeded maximum number of decimal places." }
};

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * Matcher can take 2 optional parameters with following rules:
 * - parameters not set: validates that number of digits does not exceed the maximum value of 11
 * - first parameter is present: represents the total maximum number of digits (parameter replaces the default value of 11)
 * - second parameter is present: represents the maximum number of decimal places
 * - if both parameters are present, both validation conditions must be met
 */
class DecimalNumberMatcher {

  /**
   * @param {number} [maxDigits] - specifies maximum length of number (default value of {@link DEFAULT_MAX_DIGITS})
   * @param {number} [maxDecimalPlaces] - specifies maximum number of decimal places
   */
  constructor(maxDigits, maxDecimalPlaces) {
    this.maxDigits = maxDigits == null ? DEFAULT_MAX_DIGITS : maxDigits;
    this.maxDecimalPlaces = maxDecimalPlaces;
  }

  /**
   * Function validates that string value represents a decimal number or null.
   * Decimal separator is always "."
   * @param {string|null} value - string decimal number or null
   * @returns {ValidationResult} - validation result
   */
  match(value) {
    const result = new ValidationResult();

    if (value == null) {
      return result;
    }

    const number = this._parseValue(value);
    if (!number) {
      this._addErrorToValidationResult(Errors.DOUBLE_NUMBER_E001, result);
      return result;
    }

    const errorList = this._validateNumber(number);
    if (errorList.length !== 0) {
      errorList.forEach(e => this._addErrorToValidationResult(e, result));
    }

    return result;
  }

  _parseValue(value) {
    try {
      return new Decimal(value);
    } catch (e) {
      return null;
    }
  }

  _validateNumber(number) {
    const errorList = [];

    if (this._isMaxDigitsExceeded(number)) {
      errorList.push(Errors.DOUBLE_NUMBER_E002);
    }

    if (this._isMaxDecimalPlacesExceeded(number)) {
      errorList.push(Errors.DOUBLE_NUMBER_E003);
    }

    return errorList;
  }

  _isMaxDigitsExceeded(number) {
    return number.precision(true) > this.maxDigits;
  }

  _isMaxDecimalPlacesExceeded(number) {
    return this.maxDecimalPlaces != null && number.decimalPlaces() > this.maxDecimalPlaces;
  }

  _addErrorToValidationResult(error, validationResult) {
    validationResult.addInvalidTypeError(error.code, error.message);
  }
}

module.exports = DecimalNumberMatcher;
