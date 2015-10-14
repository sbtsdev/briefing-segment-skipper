/* globals SBTS */
(function (win, doc, sm) {
    'use strict';
    SBTS.maker('SBTS.am.main360Segments');
    SBTS.am.main360Segments.init = function (customOptions) {
        /*
         * threeSixtyPlayer augmentation variables to save original functions
        */
        var originalBufferChange, originalPlaying,
            originalPause, originalStop, originalFinish;
        /*
         * our variables
        */
        var initialPlaySegment, segmentGroup, options,
            defaultOptions = {
                'briefingQuery':'.briefing',
                'segmentQuery':'.segment',
                'buttonQuery' :'.segment-button',
                'languageQuery':'.language',
                'timerQuery' : '.timer',
                'language':{
                    'inactive'  : 'Play',
                    'playing'   : 'Playing',
                    'activePaused'  : 'Paused',
                    'inactivePaused': 'Play'
                },
                'style':{
                    'loadingSegment':'loading',
                    'loadingButton':'loading',
                    'playingSegment': 'playing',
                    'playingButton': 'playing',
                    'pausedSegment': 'paused',
                    'pausedButton': 'paused'
                }
            };

        /*
         * our functions
        */
        function getSegmentPlayFromURL() {
            var queries = window.location.search.replace('?','').
                    replace('/','').split('&'),
                pair, len = queries.length, i = 0;
            for(; i < len; i += 1) {
                pair = queries[i].split('=');
                if ('segment' === pair[0]) {
                    return pair[1];
                }
            }
            return false;
        }
        function ready() {
            segmentGroup = new SBTS.am.SegmentGroup(options);
            if (initialPlaySegment) {
                segmentGroup.playSegment(initialPlaySegment);
            }
        }
        function bufferStateChanged() {
            /* jshint validthis:true */
            segmentGroup.bufferStateChanged(this.position, this.isBuffering);
            originalBufferChange.apply(this);
        }
        function playing() {
            /* jshint validthis:true */
            segmentGroup.playing(this.position);
            originalPlaying.apply(this);
        }
        function paused() {
            /* jshint validthis:true */
            segmentGroup.paused(this.position);
            originalPause.apply(this);
        }
        function stopped() {
            /* jshint validthis:true */
            segmentGroup.stopped(this.position);
            originalStop.apply(this);
        }
        function finished() {
            /* jshint validthis:true */
            segmentGroup.finished();
            originalFinish.apply(this);
        }

        // if the link was a share link to play a specific segment then
        initialPlaySegment = getSegmentPlayFromURL();

        // merge user and default options, smaller than a library
        options = defaultOptions;
        for (var op in defaultOptions) {
            if (defaultOptions.hasOwnProperty(op)) {
                if (customOptions.hasOwnProperty(op)) {
                    options[op] = customOptions[op];
                }
            }
        }

        // initialize ThreeSixtyPlayer
        win.threeSixtyPlayer = new win.ThreeSixtyPlayer();
        /*
         * save threeSixtyPlayer event functions
        */
        originalBufferChange = win.threeSixtyPlayer.events.bufferchange;
        originalPlaying = win.threeSixtyPlayer.events.whileplaying;
        originalPause = win.threeSixtyPlayer.events.pause;
        originalStop = win.threeSixtyPlayer.events.stop;
        originalFinish = win.threeSixtyPlayer.events.finish;
        /*
         * augment threeSixtyPlayer object
        */
        win.threeSixtyPlayer.events.bufferchange = bufferStateChanged;
        win.threeSixtyPlayer.events.whileplaying = playing;
        win.threeSixtyPlayer.events.pause = paused;
        win.threeSixtyPlayer.events.stop = stopped;
        win.threeSixtyPlayer.events.finish = finished;

        // connect threeSixtyPlayer to soundManager along with our own ready()
        sm.onready(function () {
            // hook into SM2 init
            win.threeSixtyPlayer.init();

            // our ready hook
            ready();
        });

        // setup soundManager
        sm.setup({
            url: '/360/swf/'
        });
    };
}(window, document, window.soundManager));
