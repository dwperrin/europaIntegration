'use strict';

var serverConfig = require('../config/config.js');
var iconv  = require('iconv-lite');

var soapSettings = serverConfig.europaSoapConnectionSettings;

module.exports = function (EuropaConfig) {

    var controller = {
        getGlobalConfig: getGlobalConfig,
        getUpdateConfig: getUpdateConfig,
        saveConfig: saveConfig
    };

    return controller;

    // GET METHODS //
    function getGlobalConfig(req, res, next) {
        EuropaConfig.findOne({isDataUpdate: false}, function(err, config) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(config);
            }
        });
    }

    function getUpdateConfig(req, res, next) {
        EuropaConfig.findOne({isDataUpdate: true}, function(err, config) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(config);
            }
        });
    }

    // PUT METHOD //
    function saveConfig(req, res, next) {
        if (req.body.isDataUpdate) {
            EuropaConfig.findOne({isDataUpdate: true}, function(err, config) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    config.isDataUpdate = req.body.isDataUpdate;
                    config.dateSince = req.body.dateSince;
                    config.key = req.body.key;
                    config.save(function(err, config) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(204).send();
                        }
                    });
                }
            });
        } else {
            EuropaConfig.findOne({isDataUpdate: false}, function(err, config) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    config.eventName = req.body.eventName;
                    config.eventShortCode = req.body.eventShortCode;
                    config.eventStart = req.body.eventStart;
                    config.eventEnd = req.body.eventEnd;
                    config.url = req.body.url;
                    config.databaseName = req.body.databaseName;
                    config.login = req.body.login;
                    config.password = req.body.password;
                    config.isDataUpdate = false;
                    config.key = req.body.key;
                    config.save(function(err, config) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(204).send();
                        }
                    });
                }
            });
        }
    }
};
