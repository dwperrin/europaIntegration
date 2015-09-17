/// <reference path="../../../../../typings/tsd.d.ts"/>
/*jshint expr: true*/
'use strict';

var app = require('express')(),
    /*jshint -W079 */
    europaSoapController = require('../../../controllers/europaSoapController.js')(),
    chai = require('chai'),
    should = chai.should(),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

var req, res, next, spyStatus, spyJson, spySend, spyLocation, savedEvent, foundEvent;

describe('controllers: EuropaSoapController', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.should.exist();
    });

    it('should be an object', function() {
        europaSoapController.should.be.a('object');
    });

    it('should send status 500 on error opening export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnOpenExport').yields(new Error('Error'), null);

        europaSoapController.lnOpenExport(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnOpenExport.restore();
        done();
    });

    it('should send status 200 and json when successfully opening export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnOpenExport').yields(null, 'data');

        europaSoapController.lnOpenExport(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnOpenExport.restore();
        done();
    });
});

describe('controllers: EuropaSoapController:lnOpenExport', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnOpenExport.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnOpenExport.should.be.a('function');
    });

    it('should send status 500 on error opening export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnOpenExport').yields(new Error('Error'), null);

        europaSoapController.lnOpenExport(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnOpenExport.restore();
        done();
    });

    it('should send status 200 and json when successfully opening export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnOpenExport').yields(null, 'data');

        europaSoapController.lnOpenExport(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnOpenExport.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetRooms', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetRooms.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetRooms.should.be.a('function');
    });

    it('should send status 500 on error getting rooms', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetRooms').yields(new Error('Error'), null);

        europaSoapController.lnGetRooms(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetRooms.restore();
        done();
    });

    it('should send status 200 and json when successfully getting rooms', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetRooms').yields(null, 'data');

        europaSoapController.lnGetRooms(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetRooms.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetRoles', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetRoles.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetRoles.should.be.a('function');
    });

    it('should send status 500 on error getting roles', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetRoles').yields(new Error('Error'), null);

        europaSoapController.lnGetRoles(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetRoles.restore();
        done();
    });

    it('should send status 200 and json when successfully getting roles', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetRoles').yields(null, 'data');

        europaSoapController.lnGetRoles(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetRoles.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetGuests', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetGuests.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetGuests.should.be.a('function');
    });

    it('should send status 500 on error getting guests', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetGuests').yields(new Error('Error'), null);

        europaSoapController.lnGetGuests(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetGuests.restore();
        done();
    });

    it('should send status 200 and json when successfully getting guests', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetGuests').yields(null, 'data');

        europaSoapController.lnGetGuests(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetGuests.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetSessions', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetSessions.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetSessions.should.be.a('function');
    });

    it('should send status 500 on error getting sessions', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetSessions').yields(new Error('Error'), null);

        europaSoapController.lnGetSessions(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetSessions.restore();
        done();
    });

    it('should send status 200 and json when successfully getting sessions', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetSessions').yields(null, 'data');

        europaSoapController.lnGetSessions(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetSessions.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetModerators', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetModerators.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetModerators.should.be.a('function');
    });

    it('should send status 500 on error getting moderators', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetModerators').yields(new Error('Error'), null);

        europaSoapController.lnGetModerators(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetModerators.restore();
        done();
    });

    it('should send status 200 and json when successfully getting moderators', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetModerators').yields(null, 'data');

        europaSoapController.lnGetModerators(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetModerators.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnGetInterventions', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnGetInterventions.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnGetInterventions.should.be.a('function');
    });

    it('should send status 500 on error getting interventions', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetInterventions').yields(new Error('Error'), null);

        europaSoapController.lnGetInterventions(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnGetInterventions.restore();
        done();
    });

    it('should send status 200 and json when successfully getting interventions', function(done) {
        sinon.stub(global.europaSoapClient, 'lnGetInterventions').yields(null, 'data');

        europaSoapController.lnGetInterventions(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnGetInterventions.restore();
        done();
    });

});

describe('controllers: EuropaSoapController:lnCloseExport', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapController.lnCloseExport.should.exist();
    });

    it('should be a function', function() {
        europaSoapController.lnCloseExport.should.be.a('function');
    });

    it('should send status 500 on error closing export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnCloseExport').yields(new Error('Error'), null);

        europaSoapController.lnCloseExport(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        global.europaSoapClient.lnCloseExport.restore();
        done();
    });

    it('should send status 200 and json when successfully closing export', function(done) {
        sinon.stub(global.europaSoapClient, 'lnCloseExport').yields(null, 'data');

        europaSoapController.lnCloseExport(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        global.europaSoapClient.lnCloseExport.restore();
        done();
    });

});

function initaliseVariables () {

    next = {};
    req = {
        query : {
            bdname: 'testbd',
            isDataUpdate: 0,
            dataSince: ''
        }
    };

    res = {
        send: function() {return this;},
        json: function() {return this;},
        status: function() {return this;},
        location: function() {return this;}
    };
    spyStatus = sinon.spy(res, 'status');
    spyJson = sinon.spy(res, 'json');
    spySend = sinon.spy(res, 'send');

    global.europaSoapClient = {
        lnOpenExport: function(args, callback) {},
        lnGetRooms: function(args, callback) {},
        lnGetRoles: function(args, callback) {},
        lnGetGuests: function(args, callback) {},
        lnGetSessions: function(args, callback) {},
        lnGetModerators: function(args, callback) {},
        lnGetInterventions: function(args, callback) {},
        lnCloseExport: function(args, callback) {},
    };
}
