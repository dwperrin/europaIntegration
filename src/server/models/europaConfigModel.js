'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var europaConfigModel = new Schema({
    eventName: {
        type: String
    },
    eventShortCode: {
        type: String
    },
    eventStart: {
        type: Date
    },
    eventEnd: {
        type: Date
    },
    url: {
        type: String
    },
    databaseName: {
        type: String,
    },
    login: {
        type: String,
    },
    password: {
        type: String
    },
    isDataUpdate: {
        type: Boolean
    },
    dateSince: {
        type: Date
    },
    key : {
        type: String
    }
});

module.exports = mongoose.model('EuropaConfig', europaConfigModel);
