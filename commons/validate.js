var validator = require('validator');
var emailValidator = require('email-validator');
var CONSTANTS = require('../commons/constants').CONSTANTS;

var dataTypes = {
	userName: {
		maxLength: 35,
		allowedChars: /^[a-zA-Z ]*$/,
		allowedCharsDesc: 'a-zA-Z and space'
	},
	title: {
		maxLength: 100,
		allowedChars: /^[a-zA-Z0-9\,\?\_\.\-\s]+$/,
		allowedCharsDesc: 'a-zA-Z0-9,?-. and space'
	},
	phone: {
		allowedChars: /^([0-9]{10})$/,
		allowedCharsDesc: '9999999999 where 9 => 0-9 with exact length of 10'
	},
	numbers: {
		allowedChars: /^[0-9]*$/,
		allowedCharsDesc: 'numbers between 0-9'
	},
	ssn: {
		allowedChars: /^([0-9]{9})$/,
		allowedCharsDesc: '999999999 where 9 => 0-9 with exact length of 9'
	}
}

module.exports.validate = {
						isInteger: function(value) {
							return value == parseInt(value, 10);
						},
						isNumber: function(value) {
							//number validation ...
							return true;
						},
						isUTC: function(value) {
							//checking utc date between 1900 to 2100.
							if (value && value < 4102425000000 && value > -2209008600000) {
								return true;
							} else {
								return false;
							}
						},
						isMobilePhone: function(value) {
							return validator.isMobilePhone(value, ['en-US','en-IN']);
						},
						isEmail: function(value) {
							return emailValidator.validate(value);
						},
						isExist: function(value) {
							return (value != undefined && value != null && value != 0 && (value + '').length > 0);
						},
						isGender: function(value) {
							return CONSTANTS.GENDER_TYPES.some(function(gender) {
								return gender == value;
							});
						},
						checkData: function(value, dataType) {
							if (dataTypes[dataType].maxLength < (value + '').length) {
								return {status: 'Error', error: '{0} length can\'t be greater than ' + dataTypes[dataType].maxLength};
							} else if (!new RegExp(dataTypes[dataType].allowedChars).test(value)) {
								return {status: 'Error', error: 'Special characters not allowed in {0}. Allowed characters are ' + dataTypes[dataType].allowedCharsDesc};
							} else {
								return {status: 'Success'};
							}
						}
					};