(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('UpdatesController', UpdatesController);

    UpdatesController.$inject = ['$rootScope','$q', 'config', 'logger'];
    /* @ngInject */
    function UpdatesController($rootScope, $q, config, logger) {

        var vm = this;

        activate();

        function activate() {
            var promises = [];

            return $q.all(promises).then(function () {
                logger.log('Activated UpdatesController');
            });
        }
    }
})();
