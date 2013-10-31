/*global require*/
// Require.js allows us to configure shortcut alias
require.config({
    paths : {
        jquery : 'vendor/jquery/jquery',
        deferredStateMachineFactory : 'vendor/deferred-state-machine/app/deferredStateMachineFactory',

        sfa : 'sfa'
    }
});

require([
    'sfa'
], function (SFA) {
    SFA.beginFalling();
});
