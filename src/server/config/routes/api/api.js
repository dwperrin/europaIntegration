/// <reference path="../../../../../typings/tsd.d.ts"/>
'use strict';

var express = require('express');
var four0four = require('../../../utils/404.js')();

var routes = function () {
    var router = express.Router();

    var europaSoapRouter = require('./europaSoapRoutes.js')();
    router.use('/europasoap', europaSoapRouter);

    router.get('/*', four0four.notFoundMiddleware);

    return router;
};

module.exports = routes;
