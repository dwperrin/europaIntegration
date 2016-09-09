/// <reference path="../../../../../typings/tsd.d.ts"/>
/*jshint expr: true*/
'use strict';

var app = require('express')(),
    europaSoapRouter = require('../../../config/routes/api/europaSoapRoutes.js')(),
    chai = require('chai'),
    should = chai.should(),
    request = require('supertest'),
    soap = require('soap'),
    serverConfig = require('../../../config/config.js');

//chai.use(sinonChai);

describe('routes: europaSoapRouter', function() {

    before(function(done) {
        this.timeout(10000);
        app.use('/europasoap', europaSoapRouter);
        soap.createClient(serverConfig.europaSoapConnectionSettings.url, function(err, client) {
            global.europaSoapClient = client;
            done();
        });
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/open')
            .expect(200);
        done();
    });

    it('GET /europasoap/rooms route should return a 200', function(done) {
        request(app).get('/europasoap/rooms')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/roles')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/guests')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/sessions')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/moderators')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/interventions')
            .expect(200);
        done();
    });

    it('GET /europasoap/open route should return a 200', function(done) {
        request(app).get('/europasoap/close')
            .expect(200);
        done();
    });
});
