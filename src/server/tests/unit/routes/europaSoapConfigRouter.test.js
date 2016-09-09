/// <reference path="../../../../../typings/tsd.d.ts"/>
/*jshint expr: true*/
'use strict';

var app = require('express')(),
    europaSoapRouter = require('../../../config/routes/api/europaSoapConfigRoutes.js')(),
    chai = require('chai'),
    should = chai.should(),
    request = require('supertest');

//chai.use(sinonChai);

describe('routes: europaSoapConfigRouter', function() {

    it('GET /europasoap/config/global route should return a 200', function(done) {
        request(app).get('/europasoap/config/global')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/config/update')
            .expect(200);
        done();
    });

    it('PUT /europasoap/save route should return a 200', function(done) {
        request(app).put('/europasoap/config/save')
            .expect(200);
        done();
    });
});
