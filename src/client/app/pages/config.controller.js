(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['$rootScope','$q', 'config', 'logger'];
    /* @ngInject */
    function ConfigController($rootScope, $q, config, logger) {

        var vm = this;

        activate();

        function activate() {
            var promises = [];

            return $q.all(promises).then(function () {
                logger.log('Activated ConfigController');
            });
        }
    }
})();
