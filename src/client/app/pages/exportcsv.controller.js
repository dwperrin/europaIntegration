(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('ExportCsvController', ExportCsvController);

    ExportCsvController.$inject = ['$rootScope','$q', 'config', 'logger', 'dataservice'];
    /* @ngInject */
    function ExportCsvController($rootScope, $q, config, logger, dataservice) {

        var vm = this;

        activate();

        function activate() {
            var promises = [getRooms(), getRoles(), getGuests(),
                            getSessions(), getModerators(),
                            getInterventions()];

            return $q.all(promises).then(function () {

                var sr = _.hashInnerJoin(vm.sessions, roomIdAccessor, vm.rooms, roomIdAccessor);
                _.map(sr, addRoomAlias);
                vm.sessionsWithRooms = sr;

                logger.log('Activated ExportCsvController');
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


        function roomIdAccessor(obj) {
            return obj['room_id'];
        };

        function addRoomAlias(obj) {
            var temp = obj['room_name'];
            temp = temp.substr(temp.indexOf(' ') + 1);
            temp = temp.replace(/ /g,'');
            temp = 'S-' + temp.toUpperCase();
            obj['room_alias'] = temp;
            return obj;
        }
    }
})();
