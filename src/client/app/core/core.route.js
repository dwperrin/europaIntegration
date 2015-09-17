(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: 'helloworld',
                config: {
                    url: '/',
                    templateUrl: 'app/layout/helloworld.html',
                    controller: 'HelloWorldController',
                    controllerAs: 'vm',
                    title: 'HellowWorld'
                }
            },
            {
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
