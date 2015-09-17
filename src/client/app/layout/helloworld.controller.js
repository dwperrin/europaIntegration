(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('HelloWorldController', HelloWorldController);

    HelloWorldController.$inject = ['$rootScope','$q', 'dataservice', 'config', 'logger'];
    /* @ngInject */
    function HelloWorldController($rootScope, $q, dataservice, config, logger) {

        var vm = this;

        activate();

        function activate() {
            var promises = [getRooms(), getRoles(), getGuests(),
                            getSessions(), getModerators(),
                            getInterventions()];

            return $q.all(promises).then(function () {
                logger.log('Activated');
            });
        }

        function getRooms() {
            return dataservice.getRooms(config.tempBase, config.tempKey).then(function (data) {
                vm.rooms = data;
                return vm.rooms;
            });
        }

        function getRoles() {
            return dataservice.getRoles(config.tempBase, config.tempKey).then(function (data) {
                vm.roles = data;
                return vm.roles;
            });
        }

        function getGuests() {
            return dataservice.getGuests(config.tempBase, config.tempKey).then(function (data) {
                vm.guests = data;
                return vm.guests;
            });
        }

        function getSessions() {
            return dataservice.getSessions(config.tempBase, config.tempKey).then(function (data) {
                vm.sessions = data;
                return vm.sessions;
            });
        }

        function getModerators() {
            return dataservice.getModerators(config.tempBase, config.tempKey).then(function (data) {
                vm.moderators = data;
                return vm.moderators;
            });
        }

        function getInterventions() {
            return dataservice.getInterventions(config.tempBase, config.tempKey).then(function (data) {
                vm.interventions = data;
                return vm.interventions;
            });
        }
    }

})();
