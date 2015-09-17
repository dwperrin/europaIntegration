
/// <reference path="../../../typings/tsd.d.ts"/>
/*jshint -W106 */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

'use strict';

var serverConfig = require('../config/config.js');
var iconv  = require('iconv-lite');

var soapSettings = serverConfig.europaSoapConnectionSettings;

module.exports = function () {

    var controller = {
        lnOpenExport: lnOpenExport,
        lnGetRooms: lnGetRooms,
        lnGetRoles: lnGetRoles,
        lnGetGuests: lnGetGuests,
        lnGetSessions: lnGetSessions,
        lnGetModerators: lnGetModerators,
        lnGetInterventions: lnGetInterventions,
        lnCloseExport: lnCloseExport
    };

    return controller;

    // GET METHODS //

    function lnOpenExport(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            login: soapSettings.login,
            password: soapSettings.password,
            isDataUpdate: req.query.isdataupdate,
            dateSince: req.query.dataSince
        };

        soapClient.lnOpenExport(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(result);
            }
        });
    }

    function lnGetRooms(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetRooms(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_room.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnGetRoles(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetRoles(args, function(err, result, raw) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_role.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnGetGuests(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetGuests(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_guest.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnGetSessions(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetSessions(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_session.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnGetModerators(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetModerators(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_moderator.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnGetInterventions(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnGetInterventions(args, function(err, result, raw) {
            if (err) {
                res.status(500).send(err);
            } else {
                var items = result.array_ln_intervention.item;
                res.status(200).json(simplifyItems(items));
            }
        });
    }

    function lnCloseExport(req, res, next) {

        var soapClient = global.europaSoapClient;

        var args = {
            bdname: req.query.bdname,
            key: req.query.key
        };

        soapClient.lnCloseExport(args, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(result);
            }
        });
    }

    function simplifyItems(items) {
        var simpleItems = [];
        for (var i = 0; i < items.length; i++) {
            var simpleItem = {};
            for (var key in items[i]) {
                if (items[i].hasOwnProperty(key) && key !== 'attributes') {
                    simpleItem[key] =  items[i][key].$value;
                }
            }
            simpleItems[i] = simpleItem;
        }
        return simpleItems;
    }
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
/*jshint +W106 */
