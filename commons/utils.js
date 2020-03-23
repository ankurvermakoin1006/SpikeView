var crypto = require('crypto');
var path = require('path');
const ENCRYPTION_KEY = 'sd5b75nb7577#^%$%*&G#CGF*&%@#%*&'
var cryptlib = require('cryptlib'),
	iv = 'F@$%^*GD$*(*#!12', //16 bytes = 128 bit
	key = cryptlib.getHashSha256(ENCRYPTION_KEY, 32) //32 bytes = 256 bits

var generatePassword = require("password-generator");
var fs = require('fs');
var moment = require('moment');

var calendarConstants = {
	mon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}
var maxLength = 8;
var minLength = 8;
var uppercaseMinCount = 1;
var lowercaseMinCount = 5;
var numberMinCount = 1;
var specialMinCount = 1;
var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-])/g;
var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

module.exports.utils = {
	CONSTANTS: require('./constants').CONSTANTS,
	mongoUtils: require('./mongoUtils').mongoUtils,
	validate: require('./validate').validate,
	cloneObject: function (object) {
		var cloneObject = {};
		Object.keys(object).forEach(function (key) {
			cloneObject[key] = object[key];
		});
		return cloneObject;
	},
	encryptText: function (text) {
		return crypto.createHash('SHA1').update(text).digest("hex");
	},
	encrypt: function (text) {
		let cryptText = cryptlib.encrypt(text, key, iv);
		return cryptText.replace(/\//g, '_spike_');
	},
	decrypt: function (text) {
		let decrptText = text.replace(/_spike_/g, '/');
		return cryptlib.decrypt(decrptText, key, iv);
	},
	formatText: function (text) {
		var result = text;
		for (var i = 1; i < arguments.length; i += 1) {
			var re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
			result = result.replace(re, arguments[i]);
		}
		return result;
	},
	formatTextByArrayObj: function (text, arrayObj) {
		var result = text;
		for (var i = 1; i <= arrayObj.length; i += 1) {
			var re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
			result = result.replace(re, arrayObj[i - 1]);
		}
		return result;
	},
	formatTextByObjRef: function (text, jsonObj) {
		var result = text;
		var re = new RegExp('\{([^}]+)\}', 'g');
		var placeHolders = text.match(re);
		placeHolders.forEach(function (placeHolder) {
			re = new RegExp(placeHolder, 'g');
			placeHolder = placeHolder.replace(/\{|\}/g, '').replace(/\./g, '"]["');
			result = result.replace(re, eval('jsonObj["' + placeHolder + '"]'));
		});
		return result;
	},
	getFullName: function (object) {
		var fullName = 'NA';
		try {
			fullName = object.getLastName() + ', ' + object.getFirstName();
		} catch (e) {
			try {
				fullName = object.lastName + ', ' + object.firstName;
			} catch (e) {}
		}
		return fullName;
	},
	getSystemTime: function (dateValue) {
		if (dateValue) {
			return new Date(dateValue).getTime();
		} else {
			return new Date().getTime();
		}
	},
	getSystemDate: function () {
		var dt = new Date();
		return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
	},
	getYear: function (date) {
		if (date) {
			return new Date(date).getFullYear();
		} else {
			return new Date().getFullYear();
		}
	},
	getMidnightEpoch: function (date) {
		if (date) {
			return new Date(date).setHours(0, 0, 0, 0)
		} else {
			return new Date().setHours(0, 0, 0, 0);
		}
	},
	getTimeDifference: function (date1, date2, diffParam) { // date1 is larger then date2
		return moment(date1).diff(moment(date2), diffParam, true); // diffParameter = days or months or years
	},
	addTime: function (date, timeToAdd, addParam) {
		return parseInt(moment(date, 'x').add(timeToAdd, addParam).format('x')); // addParam = day or month or year
	},
	subtractTime: function (date, timeToMinus, param) {
		return parseInt(moment(date, 'x').subtract(timeToMinus, param).format('x')); // addParam = day or month or year
	},
	getMonth: function (date) {
		if (date) {
			return parseInt(moment(date).format('M')); // 'M' => month
		} else {
			return parseInt(moment().format('M')); // 'M' => month
		}
	},
	getDays: function (date) {
		if (date) {
			return new Date(date).getDate();
		} else {
			new Date().getDate().getDate();
		}
	},
	getDaysInMonth: function (month) {
		return moment(month).daysInMonth();
	},
	calculateAge: function (birthDate, otherDate) {
		birthDate = new Date(birthDate);
		otherDate = new Date(otherDate);

		var years = (otherDate.getFullYear() - birthDate.getFullYear());

		if (otherDate.getMonth() < birthDate.getMonth() ||
			otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
			years--;
		}

		return years;
	},
	deriveIdFromSuccessMessage: function (message) {
		return message.substr(message.lastIndexOf(' ') + 1);
	},
	formatQueryForMongo: function (query) {
		if (query && typeof query === 'object') {
			Object.keys(query).forEach(function (key) {
				var myQueryItem = {};
				if (Array.isArray(query[key])) {
					query[key] = {
						'$in': query[key]
					};
				} else {
					query[key] = query[key];
				}
			});
			return query;
		} else {
			return query;
		}
	},
	addDaysToUTC: function (utc, noOfDays) {
		if (utc && noOfDays || (utc == 0 || noOfDays == 0)) {
			/*if (validate.isInteger(noOfDays) && validate.isInteger(utc)) {*/
			return utc + (noOfDays * 86400 * 1000);
			/*}*/
		}
	},
	utcToDate: function (pUTCString) {
		return new Date(pUTCString)
	},
	formatDate: function (pDate, pFormat) {
		if (!pDate) {
			return;
		} else {
			var formattedValue = '';
			switch (pFormat) {
				case 'MMM-DD':
					formattedValue = calendarConstants.mon[pDate.getMonth()] + '-' +
						((pDate.getDate() < 10) ? '0' + pDate.getDate() : pDate.getDate());
					break;
				case 'YYYYMMDDHHMI':
					var date = new Date(pDate);
					var year = date.getFullYear();
					var month = ("0" + (date.getMonth() + 1)).slice(-2);
					var day = date.getDate();
					var hours = date.getHours();
					var minutes = date.getMinutes();
					formattedValue = year + month + day + hours + minutes;
					break;
				default:
					var month = pDate.getMonth() + 1;
					month = (month < 10) ? '0' + month : month;
					var date = pDate.getDate();
					date = (date < 10) ? '0' + date : date;
					var year = pDate.getFullYear();
					formattedValue = month + '/' + date + '/' + year;
			}
			return formattedValue;
		}
	},
	utcToIsoDate: function (utcDate) {
		if (utcDate) {
			return new Date(utcDate).toISOString();
		}
	},
	IsoToUtcDate: function (isoDate) {
		if (isoDate) {
			return new Date(isoDate).getTime();
		}
	},
	isNumber: function (n) {
		return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
	},

	isStrongEnough: function isStrongEnough(password) {
		var uc = password.match(UPPERCASE_RE);
		var lc = password.match(LOWERCASE_RE);
		var n = password.match(NUMBER_RE);
		var sc = password.match(SPECIAL_CHAR_RE);
		var nr = password.match(NON_REPEATING_CHAR_RE);
		return password.length >= minLength &&
			!nr &&
			uc && uc.length >= uppercaseMinCount &&
			lc && lc.length >= lowercaseMinCount &&
			n && n.length >= numberMinCount &&
			sc && sc.length >= specialMinCount;
	},

	customPassword: function customPassword() {
		var password = "Abc@1234"; // testing purpose for QA Team
		// var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
		// while (!this.isStrongEnough(password)) {
		// 	password = generatePassword(randomLength, false, /[\w\d\?\-]/);
		// }
		return password;
	},

	passwordGenerator: function () {
		return this.customPassword();
	},
	// var imageRequest = { base64Img: base64imageString, name: imageName, ext: 'png'};
	saveImageIntoAppImages: function (imageRequest) {
		var data = imageRequest.base64Img.split(',')[1];
		if (data == undefined) {
			data = imageRequest.base64Img;
		}
		var buf = new Buffer(data, 'base64');
		fs.writeFile('./assets/appImages/' + imageRequest.name + '.' + imageRequest.ext, buf);
	},
	generateRandomString: function () {
		var text = '';
		var possible =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	},
	randomFileName: function (extension) {
		return moment().valueOf() + this.generateRandomString() + '.' + extension;
	},
	getFileExtension: function (filePath) {
		return path.extname(filePath);
	}
};