(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'logger'];
    /* @ngInject */
    function dataservice($http, $q, logger) {
        var apiBase = '/api/europasoap/';

        var service = {
            openExport: openExport,
            getRooms: getRooms,
            getRoles: getRoles,
            getGuests: getGuests,
            getSessions: getSessions,
            getModerators: getModerators,
            getInterventions: getInterventions,
            closeExport: closeExport
        };

        return service;

        // OPEN
        function openExport(bdname, isDataUpdate, dateSince) {

            if (!isDataUpdate) { isDataUpdate = 0;}
            if (!dateSince) { dateSince = ''; }

            var path = apiBase +
                       'open?bdname=' + bdname +
                       '&isDataUpdate=' + isDataUpdate +
                       '&isDateSince=' + dateSince;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        //ROOMS
        function getRooms(bdname, key) {

            var path = apiBase +
                       'rooms?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // ROLES
        function getRoles(bdname, key) {

            var path = apiBase +
                       'roles?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // GUESTS
        function getGuests(bdname, key) {

            var path = apiBase +
                       'guests?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // SESSIONS
        function getSessions(bdname, key) {

            var path = apiBase +
                       'sessions?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // MODERATORS
        function getModerators(bdname, key) {

            var path = apiBase +
                       'moderators?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // INTERVENTIONS
        function getInterventions(bdname, key) {

            var path = apiBase +
                       'interventions?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        // CLOSE
        function closeExport(bdname, key) {

            var path = apiBase +
                       'close?bdname=' + bdname +
                       '&key=' + key;

            return $http.get(path)
                        .then(success(path))
                        .catch(fail(path));
        }

        //COMMON FUNCTIONS
        function success(message) {
            return function (response) {
                logger.log('Successful $http.get to: ' + message);
                return response.data;
            };
        }

        function fail(message) {
            return function(error) {
                var msg = 'Failed $http.get to: ' + message + ' with error: ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            };
        }
    }
})();
