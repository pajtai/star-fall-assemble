/*global describe:false, it:false, beforeEach:false*/
define(['chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should();

    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');
    mocha.stacktrace = true;

    describe('The Deferred State Machine Factory', function() {
        var FSMFactory,
            stateMachine,
            obj,
            states,
            methodNames = [
                'walkThrough',
                'lock',
                'openDoor',
                'closeDoor',
                'kickDown'
            ];

        beforeEach(function(done) {

            obj = {
                    walkThrough: function() {},
                    lock: function() {},
                    unlock: function() {},
                    openDoor: function() { console.log('openDoor'); },
                    closeDoor: function() { return 42; },
                    kickDown: function() {}
            };

            states = {
                open: {
                        allowedMethods: [
                           'walkThrough', 'closeDoor'
                        ],
                        allowedTransitions: [
                            'shut'
                        ]
                    },

                shut: {
                        allowedMethods: [
                            'lock', 'openDoor'
                        ],
                        allowedTransitions: [
                            'open', 'destroyed'
                        ]
                    },
                locked: {
                        allowedMethods: [
                            'unlock', 'kickDown'
                        ],
                        allowedTransitions: [
                            'shut', 'destroyed'
                        ]
                    },
                destroyed: {
                        // End state
                    }
            };

            injector.require(['deferredStateMachineFactory'], function (factory) {
                    stateMachine = factory(obj, states);
                    FSMFactory = factory;
                    done();
                },
                function () {
                    console.log('Squire error.');
                });
        });

        it('doesn\'t create a global if amd is present', function() {
            should.exist(window.define);
            should.exist(window.define.amd);
            should.not.exist(window.deferredStateMachineFactory);
        });


        it('returns an object that is the original object', function() {
            stateMachine.should.equal(obj);
        });

        describe('returns an FSM. The Deferred State Machine', function() {
            describe('getStates method', function() {
                it('return an array of string representing the states in the passed in config', function() {
                    stateMachine.getStates().should.deep.equal([
                        'open', 'shut', 'locked', 'destroyed'
                    ]);
                });
                it('should correctly return the states of one FSM after a second one is created', function() {
                    var fsm2;

                    fsm2 = new FSMFactory({}, {
                        'play': {},
                        'pause':{}
                    });
                    fsm2.getStates().should.deep.equal(['play', 'pause']);
                    stateMachine.getStates().should.deep.equal([
                        'open', 'shut', 'locked', 'destroyed'
                    ]);
                });
            });

            describe('getState method', function() {
                it('returns "undefined" after FSM initializiation', function() {
                    should.not.exist(stateMachine.getState());
                });
            });

            describe('transition method', function() {
                it('returns a promise', function() {
                    var transitionPromise = stateMachine.transition();
                    isAPromise(transitionPromise);
                });
                it('correctly changes the state of the FSM after a successful transition', function(done) {
                    stateMachine.transition('open').done(function() {
                        stateMachine.getState().should.equal('open');
                        done();
                    });
                });
                it('does not change the state of the FSM after a failed transition to a disallowed state', function(done) {
                    stateMachine.transition('open');
                    stateMachine.transition('locked').fail(function() {
                        stateMachine.getState().should.equal('open');
                        done();
                    });
                });
                it('does not change the state of the FSM after a failed transition', function(done) {
                    stateMachine.transition('blargh').fail(function() {
                        should.not.exist(stateMachine.getState());
                        done();
                    });
                });
            });

            describe('methods described in the state options', function() {
                it('all return promises', function() {
                    $.each(methodNames, function(index, method) {
                        isAPromise(stateMachine[method]());
                    });
                });
                it('fail if they are not available in the current state', function(done) {
                     stateMachine.openDoor().fail(function() {
                         // cannot use done directly, since the fail is called with a string
                         done();
                     });
                });
                it('resolve if they are available in the current state', function(done) {
                    stateMachine.transition('open').done(function() {
                        stateMachine.closeDoor('now').done(function() {
                            done();
                        });
                    });
                });
                it('resolve with their return values', function(done) {
                    stateMachine.transition('open').done(function() {
                        stateMachine.closeDoor().done(function(returned) {
                            returned.should.equal(42);
                            done();
                        });
                    });
                });
                it('are called with the correct arguments', function(done) {
                    sinon.spy(obj, 'closeDoor');

                    stateMachine.transition('open').done(function() {
                        stateMachine.closeDoor(1, 2, 3).done(function() {
                            obj.closeDoor.should.have.been.calledOnce;
                            obj.closeDoor.should.have.been.calledWithExactly(1,2,3);
                            done();
                        });
                    });
                });
                // Add test for arguments to methods and method calls after transitions
            });
        });
    });

    function isAPromise(promise) {
        var testFor, testAgainst;

        should.exist(promise);

        testFor = [promise.done, promise.fail, promise.progress, promise.then];
        testAgainst = [promise.resolve, promise.reject];

        $.each(testFor, function(index, method) {
            should.exist(method);
            method.should.be.a.Function;
        });
        $.each(testAgainst, function(index, method) {
            should.not.exist(method);
        });
    }
});