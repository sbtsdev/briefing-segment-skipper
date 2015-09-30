/* globals SBTS */
(function (win, doc, sm) {
    'use strict';
    /*
     * threeSixtyPlayer augmentation variables to save original functions
    */
    var originalPlaying, originalFinish;
    /*
     * our variables
    */
    var sectionGroup;

    /*
     * our functions
    */
    function ready() {
        sectionGroup = new SBTS.am.SectionGroup('.briefing', '.section');
    }
    function playing() {
        /* jshint validthis:true */
        sectionGroup.playing(this.position);
        originalPlaying.apply(this);
    }
    function finished() {
        /* jshint validthis:true */
        sectionGroup.finished();
        originalFinish.apply(this);
    }

    // initialize ThreeSixtyPlayer
    win.threeSixtyPlayer = new win.ThreeSixtyPlayer();
    /*
     * save threeSixtyPlayer event functions
    */
    originalPlaying = win.threeSixtyPlayer.events.whileplaying;
    originalFinish = win.threeSixtyPlayer.events.finish;
    /*
     * augment threeSixtyPlayer object
    */
    win.threeSixtyPlayer.events.whileplaying = playing;
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
}(window, document, window.soundManager));
