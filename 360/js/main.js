/* globals SBTS */
(function (win, doc, sm) {
    'use strict';
    SBTS.maker('SBTS.am.main360Sections');
    SBTS.am.main360Sections.init = function (briefingQuery, sectionQuery) {
        /*
         * threeSixtyPlayer augmentation variables to save original functions
        */
        var originalPlaying, originalPause, originalFinish;
        /*
         * our variables
        */
        var sectionGroup, bQuery, sQuery;

        /*
         * our functions
        */
        function ready() {
            sectionGroup = new SBTS.am.SectionGroup(bQuery, sQuery);
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

        bQuery = briefingQuery;
        sQuery = sectionQuery;

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
