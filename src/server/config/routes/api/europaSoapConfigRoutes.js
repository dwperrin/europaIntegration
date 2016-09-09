/// <reference path="../../../../../typings/tsd.d.ts"/>
'use strict';

var express = require('express');
var four0four = require('../../../utils/404.js')();
/*jshint -W079 */

var EuropaConfig = require('../../../models/europaConfigModel.js');
var europaSoapConfigController = require('../../../controllers/europaSoapConfigController.js')(EuropaConfig);

var routes = function () {

    var router = express.Router();

    router.get('/global', europaSoapConfigController.getGlobalConfig);
    router.get('/update', europaSoapConfigController.getUpdateConfig);
    router.put('/save', europaSoapConfigController.saveConfig);

    return router;
};

module.exports = routes;
