(function() {
    'use strict';

    angular
        .module('app.pages')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/pages/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'Dashboard',
                }
            },
            {
                state: 'rawdata',
                config: {
                    url: '/rawdata',
                    templateUrl: 'app/pages/rawdata.html',
                    controller: 'RawDataController',
                    controllerAs: 'vm',
                    title: 'Raw Data',
                }
            },
            {
                state: 'exportcsv',
                config: {
                    url: '/exportcsv',
                    templateUrl: 'app/pages/exportcsv.html',
                    controller: 'ExportCsvController',
                    controllerAs: 'vm',
                    title: 'Export Csv',
                }
            },
            {
                state: 'updates',
                config: {
                    url: '/updates',
                    templateUrl: 'app/pages/updates.html',
                    controller: 'UpdatesController',
                    controllerAs: 'vm',
                    title: 'Updates',
                }
            },
            {
                state: 'config',
                config: {
                    url: '/config',
                    templateUrl: 'app/pages/config.html',
                    controller: 'ConfigController',
                    controllerAs: 'vm',
                    title: 'Config',
                }
            }
        ];
    }
})();
