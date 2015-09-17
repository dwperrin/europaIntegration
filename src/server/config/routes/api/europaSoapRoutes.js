/// <reference path="../../../../../typings/tsd.d.ts"/>
'use strict';

var express = require('express');
var four0four = require('../../../utils/404.js')();
/*jshint -W079 */

var europaSoapController = require('../../../controllers/europaSoapController.js')();

var routes = function () {

    var router = express.Router();

    router.get('/open', europaSoapController.lnOpenExport);
    router.get('/rooms', europaSoapController.lnGetRooms);
    router.get('/roles', europaSoapController.lnGetRoles);
    router.get('/guests', europaSoapController.lnGetGuests);
    router.get('/sessions', europaSoapController.lnGetSessions);
    router.get('/moderators', europaSoapController.lnGetModerators);
    router.get('/interventions', europaSoapController.lnGetInterventions);
    router.get('/close', europaSoapController.lnCloseExport);

    return router;
};

module.exports = routes;
