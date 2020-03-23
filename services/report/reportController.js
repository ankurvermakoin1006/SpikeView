var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Report = function () {
    return {
        reportId: 0,
        reportedBy: 0,  
        roleId: 0,     
        reportType: null,
        reportTypeId: new Object(),
        reasonType: new Array(),
        reason: null,
        reportDate: 0        
    }
};

function ReportAPI(reportRecord) {
    var report = new Report();
    report.getReportId = function () {
        return this.reportId;
    };
    report.setReportId = function (reportId) {
        if (reportId) {
            if (validate.isInteger(reportId)) {
                this.reportId = reportId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, reportId, 'reportId')
                };
            }
        }
    };
    report.getReportedBy = function () {
        return this.reportedBy;
    };
    report.setReportedBy = function (reportedBy) {
        this.reportedBy = reportedBy;
    } 
    report.getRoleId = function () {
        return this.roleId;
    };
    report.setRoleId = function (roleId) {
        this.roleId = roleId;
    } 
    report.getReportType = function () {
        return this.reportType;
    };
    report.setReportType = function (reportType) {
        this.reportType = reportType;
    } 
    report.getReportTypeId = function () {
        return this.reportTypeId;
    };
    report.setReportTypeId = function (reportTypeId) {
        this.reportTypeId = reportTypeId;
    } 
    report.getReasonType = function () {
        return this.reasonType;
    };
    report.setReasonType = function (reasonType) {
        this.reasonType = reasonType;
    } 
    report.getReason = function () {
        return this.reason;
    };
    report.setReason = function (reason) {
        this.reason = reason;
    } 
    report.getReportDate = function () {
        return this.reportDate;
    };
    report.setReportDate = function (reportDate) {
        this.reportDate = reportDate;
    } 

    if (reportRecord) {
        var errorList = [];
        try {
            report.setReportId(reportRecord.reportId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReportedBy(reportRecord.reportedBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setRoleId(reportRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReportType(reportRecord.reportType);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReportTypeId(reportRecord.reportTypeId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReasonType(reportRecord.reasonType);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReason(reportRecord.reason);
        } catch (e) {
            errorList.push(e);
        }
        try {
            report.setReportDate(reportRecord.reportDate);
        } catch (e) {
            errorList.push(e);
        }
     
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return report;
}

module.exports.ReportAPI = ReportAPI;