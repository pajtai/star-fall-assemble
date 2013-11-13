/*global require*/
// Require.js allows us to configure shortcut alias
require.config({
    'packages': [
        { 'name': 'lodash', 'location': 'vendor/lodash-amd/compat' }
    ],
    paths : {
        jquery : 'vendor/jquery/jquery',
        touchSwipe : 'vendor/jquery-touchswipe/jquery.touchSwipe',
        deferredStateMachineFactory : 'vendor/deferred-state-machine/app/deferredStateMachineFactory',
    }
});

require([
    'sfa'
], function (SFA) {
    SFA.beginFalling();
});
