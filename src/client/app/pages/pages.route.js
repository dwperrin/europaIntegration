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
                state: 'exportcsv',
                config: {
                    url: '/exportcsv',
                    templateUrl: 'app/pages/exportcsv.html',
                    controller: 'ExportCsvController',
                    controllerAs: 'vm',
                    title: 'Export',
                }
            }
        ];
    }
})();