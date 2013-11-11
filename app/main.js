/*global require*/
// Require.js allows us to configure shortcut alias
require.config({
    paths : {
        jquery : 'vendor/jquery/jquery',
        forEach : 'vendor/lodash-amd/compat/collection/forEach',
        touchSwipe : 'vendor/TouchSwipe-jquery-Plugin/jquery.touchSwipe',
        deferredStateMachineFactory : 'vendor/deferred-state-machine/app/deferredStateMachineFactory',

        sfa : 'sfa'
    }
});

require([
    'sfa'
], function (SFA) {
    SFA.beginFalling();
});
