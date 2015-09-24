(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('ExportCsvController', ExportCsvController);

    ExportCsvController.$inject = ['$rootScope','$q', 'config', 'logger', 'dataservice', 'moment', '$timeout'];
    /* @ngInject */
    function ExportCsvController($rootScope, $q, config, logger, dataservice, moment, $timeout) {

        var vm = this;
        vm.gridOptions = {};

        vm.gridOptions.enableSorting = true;
        vm.gridOptions.enableColumnResizing = true;
        vm.gridOptions.enableGridMenu = true;
        vm.gridOptions.enableSelectAll = true;
        vm.gridOptions.exporterCsvFilename = 'export-' + '15BICHAT' + '-' +  moment().toISOString() + '.csv';
        vm.gridOptions.exporterMenuPdf = false;
        vm.gridOptions.exporterOlderExcelCompatibility = true;
        vm.gridOptions.columnDefs = [
            {name: 'eventtitle', field                :'eventTitle()', minWidth: '150'},
            {name: 'eventshorttitle', field           :'eventShortTitle()', minWidth: '150'},
            {name: 'eventstart', field                :'eventStart()', minWidth: '150'},
            {name: 'eventend', field                  :'eventEnd()', minWidth: '150'},
            {name: 'venuename', field                 :'venueName()', minWidth: '150'},
            {name: 'roomname', field                  :'room_name', minWidth: '150'},
            {name: 'roomalias', field                 :'room_alias', minWidth: '150'},
            {name: 'roomcapacity', field              :''},
            {name: 'sessiontitle', field              :'session_name', minWidth: '150'},
            {name: 'sessionsubtitle', field           :''},
            {name: 'sessiontheme', field              :''},
            {name: 'sessiontype', field               :'session_type', minWidth: '150'},
            {name: 'sessioncustomcode', field         :'session_id', minWidth: '50'},
            {name: 'sessionstart', field              :'sessionStart()', minWidth: '150'},
            {name: 'sessionend', field                :'sessionEnd()', minWidth: '150'},
            {name: 'sessionmoderatortitle', field     :'moderator_title', minWidth: '150'},
            {name: 'sessionmoderators', field         :'moderator_names', minWidth: '150'},
            {name: 'presentationorder', field         :'intervention_order', minWidth: '50'},
            {name: 'presentationtitle', field         :'intervention_title', minWidth: '150'},
            {name: 'presentationsubtitle', field      :''},
            {name: 'presentationcustomcode', field    :'intervention_id', minWidth: '50'},
            {name: 'presentationstart', field         :'interventionStart()', minWidth: '150'},
            {name: 'presentationend', field           :'interventionEnd()', minWidth: '150'},
            {name: 'speakertitle', field              :'guest_title', minWidth: '150'},
            {name: 'speakerfirstname', field          :'guest_firstname', minWidth: '150'},
            {name: 'speakerlastname', field           :'guest_lastname', minWidth: '150'},
            {name: 'speakeremail', field              :'guest_email', minWidth: '150'},
            {name: 'speakerbarcode', field            :'guest_badge', minWidth: '150'},
            {name: 'speakerstreetaddressline1', field :''},
            {name: 'speakerstreetaddressline2', field :''},
            {name: 'speakerstreetaddressline3', field :''},
            {name: 'speakertown', field               :'guest_town', minWidth: '150'},
            {name: 'speakerpostcode', field           : ''},
            {name: 'speakercountry', field            :'guest_country', minWidth: '150'},
            {name: 'speakerphonenumber', field        :'guest_phone', minWidth: '150'},
            {name: 'speakermobilenumber', field       :'guest_mobile', minWidth: '150'},
            {name: 'speakerfaxnumber', field          :''},
            {name: 'speakerwebsite', field            :''}
        ];

        activate();

        function activate() {
            var promises = [getRooms(), getRoles(), getGuests(),
                            getSessions(), getModerators(),
                            getInterventions()];

            return $q.all(promises).then(function () {

                var sr = _.hashInnerJoin(vm.sessions, roomIdAccessor, vm.rooms, roomIdAccessor);
                _.map(sr, addRoomAlias);
                _.map(sr, addModerators);
                var ig = _.hashLeftOuterJoin(vm.interventions, guestIdAccessor, vm.guests, guestIdAccessor);
                var srig = _.hashFullOuterJoin(ig, sessionIdAccessor, sr, sessionIdAccessor);

                var srigcomputed = _.forEach(srig, function (row) {

                    row.eventTitle = function() {
                        return '15eme Bichat';
                    };
                    row.eventShortTitle = function() {
                        return '15BICHAT';
                    };
                    row.eventStart = function()  {
                        return '08/10/2015';
                    };
                    row.eventEnd = function() {
                        return '18/10/2015';
                    };
                    row.venueName = function() {
                        return 'Palais de congés de Paris';
                    };
                    row.sessionStart = function() {
                        return this['session_date'] + ' ' + this['session_start'];
                    };
                    row.sessionEnd = function() {
                        return this['session_date'] + ' ' + this['session_end'];
                    };
                    row.interventionStart = function() {
                        return this['session_date'] + ' ' + this['intervention_from'];
                    };
                    row.interventionEnd = function() {
                        return this['session_date'] + ' ' + this['intervention_to'];
                    };
                });

                var sorted = _.sortByAll(srigcomputed, ['session_id', 'intervention_order']);

                vm.sessionsWithRooms = sr;
                vm.presentationsWithSpeakers = ig;
                vm.sessionRoomsPresSpeakers = sorted;

                vm.presCount = vm.interventions.length;
                vm.presCountCheck1 = ig.length;
                vm.presCountCheck2 = sorted.length;
                vm.sessCount = vm.sessions.length;
                vm.sessCountCheck = sr.length;

                vm.gridOptions.data = sorted;

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
        }

        function guestIdAccessor(obj) {
            return obj['guest_id'];
        }

        function sessionIdAccessor(obj) {
            return obj['session_id'];
        }

        function addRoomAlias(obj) {
            var temp = obj['room_name'];
            temp = temp.substr(temp.indexOf(' ') + 1);
            temp = temp.replace(/ /g,'');
            temp = 'S-' + temp.toUpperCase();
            obj['room_alias'] = temp;
            return obj;
        }

        function addModerators(obj) {
            var mods = vm.moderators;
            var guests = vm.guests;
            var sessId = obj['session_id'];
            var moderatorsForSession = _.filter(mods, {'session_id': sessId});
            if (moderatorsForSession.length <= 0) {
                return obj;
            }
            obj['moderator_title'] = moderatorsForSession[0]['moderator_role'];
            var modNames = '';
            _.forEach(moderatorsForSession, function(mfs) {
                var guestId = mfs['guest_id'];
                var guest = _.find(guests, {'guest_id': guestId});
                modNames += guest['guest_initials'] + ' ' + guest['guest_lastname'] + ', ';
            });
            modNames = _.trim(modNames);
            modNames = modNames.slice(0,-1);
            obj['moderator_names'] = modNames;
            return obj;
        }
    }
})();
