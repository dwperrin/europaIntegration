(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope','$q', 'config', 'logger'];
    /* @ngInject */
    function DashboardController($rootScope, $q, config, logger) {

        var vm = this;

        activate();

        function activate() {
            var promises = [];

            return $q.all(promises).then(function () {
                logger.log('Activated DashboardController');
            });
        }
    }
})();

