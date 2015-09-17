(function() {
    'use strict';

    angular
        .module('blocks.filter')
        .filter('advancedFilter', advancedFilter);

    advancedFilter.$inject = ['$filter', 'logger'];

    function advancedFilter($filter, logger) {
        return function(data, text) {
            var textArr = text.split(' ');
            angular.forEach(textArr, function(test) {
                if (test) {
                    data = $filter('filter')(data, test);
                }
            });
            return data;
        };
    }
})();
