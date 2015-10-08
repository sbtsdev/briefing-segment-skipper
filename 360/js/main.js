/* globals SBTS */
(function (win, doc, sm) {
    'use strict';
    SBTS.maker('SBTS.am.main360Sections');
    SBTS.am.main360Sections.init = function (customOptions) {
        /*
         * threeSixtyPlayer augmentation variables to save original functions
        */
        var originalPlaying, originalPause, originalFinish;
        /*
         * our variables
        */
        var sectionGroup, options,
            defaultOptions = {
                'briefingQuery':'.briefing',
                'sectionQuery':'.section',
                'buttonQuery' :'.section-button',
                'languageQuery':'.language',
                'timerQuery' : '.timer',
                'language':{
                    'inactive'  : 'Play',
                    'playing'   : 'Playing',
                    'activePaused'  : 'Paused',
                    'inactivePaused': 'Play'
                },
                'style':{
                    'playingSection': 'playing',
                    'playingButton': 'playing',
                    'pausedSection': 'paused',
                    'pausedButton': 'paused'
                }
            };

        /*
         * our functions
        */
        function ready() {
            sectionGroup = new SBTS.am.SectionGroup(options);
        }
        function playing() {
            /* jshint validthis:true */
            sectionGroup.playing(this.position);
            originalPlaying.apply(this);
        }
        function paused() {
            /* jshint validthis:true */
            sectionGroup.paused(this.position);
            originalPause.apply(this);
        }
        function finished() {
            /* jshint validthis:true */
            sectionGroup.finished();
            originalFinish.apply(this);
        }

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
        originalPlaying = win.threeSixtyPlayer.events.whileplaying;
        originalPause = win.threeSixtyPlayer.events.pause;
        originalFinish = win.threeSixtyPlayer.events.finish;
        /*
         * augment threeSixtyPlayer object
        */
        win.threeSixtyPlayer.events.whileplaying = playing;
        win.threeSixtyPlayer.events.pause = paused;
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
