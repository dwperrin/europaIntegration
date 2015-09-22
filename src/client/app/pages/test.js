(function() {
    'use strict';

    angular
        .module('app.test')
        .controller('TestController', TestController);

    TestController.$inject = ['$rootScope','$q', 'config', 'logger'];
    /* @ngInject */
    function TestController($rootScope, $q, config, logger) {

        var vm = this;

        activate();

        function activate() {
            var promises = [];

            return $q.all(promises).then(function () {
                logger.log('Activated TestController');
            });
        }
    }
})();
