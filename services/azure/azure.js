module.exports = function (app) {
    app.post('/ui/azure/sas', function (req, res) { //To get Azure token
        try {
            getAzureSASKey(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.post('/app/azure/sas', function (req, res) { //To get Azure token
        try {
            getAzureSASKey(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.post('/ui/azure/upload', function (req, res) { //To upload file to Azure
        try {
            uploadFileToAzure(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.post('/app/azure/upload', function (req, res) { //To upload file to Azure
        try {
            uploadFileToAzure(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var config = require('../../env/config.js').getConf();
var utils = require('../../commons/utils').utils;
var azure = require('azure-storage');
var fs = require('fs');
var REQUEST_CODES = utils.CONSTANTS.REQUEST_CODES;
const container = config.apps.azure.container;
const blobService = azure.createBlobService(config.apps.azure.connection_string);
const thumbnail_container = config.apps.azure.thumbnail_container;

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

convertMediaToMP3 = (inAudioFile, outMP3File, callback) => {
    if (utils.getFileExtension(inAudioFile) === '.mp3') {
        return callback({
            status: REQUEST_CODES.SUCCESS,
            message: 'Already a mp3 file.',
        });
    }
    new ffmpeg(inAudioFile)
        .audioCodec('libmp3lame')
        .save(outMP3File)
        .on('error', function (err) {
            return callback({
                status: REQUEST_CODES.FAIL,
                message: 'MP3 conversion failed.',
                Error: err
            });
        })
        .on('end', function () {
            return callback({
                status: REQUEST_CODES.SUCCESS,
                message: 'MP3 conversion Completed.',
                fileName: outMP3File
            });
        });
}

uploadFileToAzure = (req, callback) => {
    var tempDir = './temp/';
    var userId = req.body.userId;
    var audioFiles = req.files.audioFiles;
    var newMP3FileName = utils.randomFileName('mp3');

    var inFilePath = tempDir + req.body.fileName;
    var outFilepath = tempDir + newMP3FileName;
    if (utils.getFileExtension(req.body.fileName) === '.mp3') {
        inFilePath = tempDir + newMP3FileName;
    }

    if (Object.keys(req.files).length == 0) {
        return callback({
            status: REQUEST_CODES.FAIL,
            message: 'No files were uploaded.',
            result: error
        });
    } else {
        audioFiles.mv(inFilePath, function (err) {
            if (err) {
                return callback({
                    status: REQUEST_CODES.FAIL,
                    message: 'File saving to temp dir failed.',
                    result: err
                });
            } else {
                convertMediaToMP3(inFilePath, outFilepath, function (resp) {
                    if (resp.status == REQUEST_CODES.SUCCESS) {
                        let blobPath = 'sv_' + userId + '/soundtrack/' + newMP3FileName;
                        blobService.createBlockBlobFromLocalFile(container, blobPath, outFilepath, function (error) {
                            if (error) {
                                removeTempFiles([inFilePath, outFilepath]);
                                return callback({
                                    status: REQUEST_CODES.FAIL,
                                    message: 'File failed to upload.',
                                    result: error
                                });
                            } else {
                                removeTempFiles([inFilePath, outFilepath]);
                                return callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: 'File uploaded to azure successfully.',
                                    result: blobPath
                                });
                            }
                        });
                    } else {
                        return callback({
                            status: REQUEST_CODES.FAIL,
                            message: 'File conversion failed.',
                        });
                    }
                });
            }
        });
    }
}

removeTempFiles = (files) => {
    if (files[0] != files[1]) {
        fs.unlink(files[0]);
        fs.unlink(files[1]);
    } else {
        fs.unlink(files[0]);
    }
}

getAzureSASKey = (req, callback) => {
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
            Start: startDate,
            Expiry: expiryDate
        }
    };
    var sasToken = blobService.generateSharedAccessSignature(container, null, sharedAccessPolicy);
    if (sasToken) {
        return callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.CONSTANTS.AZURE_CODES.SASKEY_SUCCESS_MSG,
            result: {
                sasToken: sasToken,
                container: container,
                thumbnail_container: thumbnail_container
            }
        });
    } else {
        return callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.FAIL_MSG
        });
    }

}
module.exports.getAzureSASKey = getAzureSASKey