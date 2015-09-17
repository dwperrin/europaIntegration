var config = {};

config.test = {};
config.dev = {};
config.build = {};
config.productionTest = {};
config.productionStaging = {};
config.productionLive = {};
config.test.dbUri = 'mongodb://localhost/europa-sm-testdb';
config.dev.dbUri = 'mongodb://localhost/europa-sm-devdb';
config.build.dbUri = 'mongodb://localhost/europa-sm-builddb';
config.productionTest.dbUri = 'mongodb://localhost/europa-sm-prodtestdb';
config.productionStaging.dbUri = 'mongodb://localhost/europa-sm-prodstagingdb';
config.productionLive.dbUri = 'mongodb://localhost/europa-sm-prodlivedb';

config.europaSoapConnectionSettings = {
    url: 'https://programme.europa-organisation.com/ws/webservice.php?wsdl',
    login: 'openslide',
    password: '8u5yHc7Q',
};

module.exports = config;
