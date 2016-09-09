/// <reference path="../../../../../typings/tsd.d.ts"/>
/*jshint expr: true*/
/*jshint -W106 */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var app = require('express')(),
    /*jshint -W079 */
    EuropaConfig = require('../../../models/europaConfigModel.js'),
    europaSoapConfigController = require('../../../controllers/europaSoapConfigController.js')(EuropaConfig),
    chai = require('chai'),
    should = chai.should(),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

var req, res, next, spyStatus, spyJson, spySend, reqUpdate, reqGlobal;

describe('controllers: EuropaSoapConfigController', function() {

    it('should be defined', function() {
        europaSoapConfigController.should.exist;
    });

    it('should be an object', function() {
        europaSoapConfigController.should.be.a('object');
    });
});

describe('controllers: EuropaSoapConfigController:getGlobalConfig', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapConfigController.getGlobalConfig.should.exist;
    });

    it('should be a function', function() {
        europaSoapConfigController.getGlobalConfig.should.be.a('function');
    });

    it('should send status 500 on error getting global config', function(done) {
        sinon.stub(EuropaConfig, 'findOne').yields(new Error('Error'), null);

        europaSoapConfigController.getGlobalConfig(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        EuropaConfig.findOne.restore();
        done();
    });

    it('should send status 200 and json when successfully getting global config', function(done) {
        sinon.stub(EuropaConfig, 'findOne').yields(null, 'data');

        europaSoapConfigController.getGlobalConfig(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        EuropaConfig.findOne.restore();
        done();
    });
});

describe('controllers: EuropaSoapConfigController:getUpdateConfig', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapConfigController.getUpdateConfig.should.exist;
    });

    it('should be a function', function() {
        europaSoapConfigController.getUpdateConfig.should.be.a('function');
    });

    it('should send status 500 on error getting update config', function(done) {
        sinon.stub(EuropaConfig, 'findOne').yields(new Error('Error'), null);

        europaSoapConfigController.getUpdateConfig(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        EuropaConfig.findOne.restore();
        done();
    });

    it('should send status 200 and json when successfully getting update config', function(done) {
        sinon.stub(EuropaConfig, 'findOne').yields(null, 'data');

        europaSoapConfigController.getUpdateConfig(req, res, next);

        spyStatus.should.have.been.calledWith(200).calledOnce;
        spyJson.should.have.been.calledOnce;
        EuropaConfig.findOne.restore();
        done();
    });

    it('should send status 500 on error getting update config', function(done) {
        sinon.stub(EuropaConfig, 'findOne').yields(new Error('Error'), null);

        europaSoapConfigController.getUpdateConfig(req, res, next);

        spyStatus.should.have.been.calledWith(500).calledOnce;
        spySend.should.have.been.calledOnce;
        EuropaConfig.findOne.restore();
        done();
    });

});

describe('controllers: EuropaSoapConfigController:saveConfig', function() {

    beforeEach(initaliseVariables);

    it('should be defined', function() {
        europaSoapConfigController.saveConfig.should.exist;
    });

    it('should be a function', function() {
        europaSoapConfigController.saveConfig.should.be.a('function');
    });
});

function initaliseVariables () {

    next = {};
    req = {};
    reqUpdate = {
        body: {
            isDataUpdate: true,
            dataSince: '01/01/1970',
            key: 'key'
        }
    };
    reqGlobal = {
        body: {
            eventName: 'Test Event',
            eventShortCode: '15TEST',
            eventStart: '01/01/2015',
            eventEnd: '04/01/2015',
            url: 'http://test.com/test/wsdl',
            databaseName: 'testdb',
            login: 'login',
            password: 'password',
            key: 'key'
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

}
