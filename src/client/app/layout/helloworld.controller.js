(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('HelloWorldController', HelloWorldController);

    HelloWorldController.$inject = ['$rootScope', 'config', 'logger'];
    /* @ngInject */
    function HelloWorldController($rootScope, config, logger) {

        activate();

        function activate() {
            logger.log(config.appTitle + ' loaded!', null);
        }
    }

})();
