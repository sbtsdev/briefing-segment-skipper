/* globals SBTS,ThreeSixtyPlayer */
(function (win) {
    'use strict';
SBTS.maker('SBTS.am.Section');
/* Create a section class to hold common stuff */
SBTS.am.Section = function (briefing, el, options) {
    this._soundInstance = null;
    this._times = {begin:0,end:Number.POSITIVE_INFINITY};

    this._options = options;
    this._briefing = briefing;
    this._elem = el;
    this._elemA = el.querySelector(options.buttonQuery);
    this._language = this._elemA.querySelector(options.languageQuery);
    this.timer = this._elemA.querySelector(options.timerQuery);

    this.setTimer();
    this._lastPlayedTime = this._times.begin;
    this.updateDisplayTime(this._times.end);
    this.updateLanguage(options.language.inactive);
    this.setSoundManagerInstance();
    this.addEvents();
};
SBTS.am.Section.prototype.setTimer = function () {
    this._times = {
        begin:  parseInt(this._elemA.getAttribute('data-begin'), 10) * 1000,
        end:    parseInt(this._elemA.getAttribute('data-end'), 10) * 1000
    };
};
SBTS.am.Section.prototype.setSoundManagerInstance = function () {
    if (ThreeSixtyPlayer && win.threeSixtyPlayer) {
        this._soundInstance = win.threeSixtyPlayer
            .getSoundByURL(this._briefing.href);
    }
};
SBTS.am.Section.prototype.play = function (e) {
    var sI = this._soundInstance,
        startFrom = this._times.begin;
    e.preventDefault();
    if (win.threeSixtyPlayer) {
        if (! sI) {
            win.threeSixtyPlayer.handleClick({
                target:this._briefing,
                preventDefault:function(){}});
            this.setSoundManagerInstance();
            sI = this._soundInstance;
        }
        if ((sI.readyState === 3) &&
            (sI.playState === 1) &&
            /* if the current position is within the play range then the
             * user is trying to play or pause this section */
            (this.inSectionRange(sI.position))) {
            if (sI.paused) {
                sI.resume();
                this.updateDisplayStatus('playing', true);
                this.updateDisplayStatus('paused', false);
                this.updateLanguage(this._options.language.playing);
            } else {
                sI.pause();
                this.updateDisplayStatus('paused', true);
                this.updateLanguage(this._options.language.activePaused);
            }
        } else {
            /* user could have clicked on a section for the first time
             * or clicked on a section that is not currently playing */
            /* startFrom uses division (/) and Math.ceil to make up for
             * partial play seconds (e.g. stopping at 122998 because playing
             * more of the sound would put it past the end time of 13 sec.) */
            startFrom = (Math.ceil(this._lastPlayedTime / 1000) >=
                        (this._times.end / 1000)) ?
                            this._times.begin : this._lastPlayedTime;
            sI.stop();
            sI.play({
                from    : startFrom,
                to      : this._times.end
            });
        }
    }
};
SBTS.am.Section.prototype.inSectionRange = function (time) {
    return (time > this._times.begin) && (time < this._times.end);
};
SBTS.am.Section.prototype.setLastPlayedTime = function (time) {
    this._lastPlayedTime = time;
};
SBTS.am.Section.prototype.addEvents = function () {
    this._elemA.addEventListener('click', this.play.bind(this));
};
SBTS.am.Section.prototype.playing = function (time) {
    if (this.inSectionRange(time)) {
        this.setLastPlayedTime(time);
        this.updateDisplayTime(time);
        this.updateDisplayStatus('playing', true);
        this.updateDisplayStatus('paused', false);
        this.updateLanguage(this._options.language.playing);
        return true; // yes, it was highlighted
    } else {
        if (this._lastPlayedTime !== this._times.begin) {
            // it's only paused if it already started
            this.updateDisplayStatus('paused', true);
            this.updateLanguage(this._options.language.inactivePaused);
        }
        this.updateDisplayStatus('playing', false);
        return false;
    }
};
SBTS.am.Section.prototype.paused = function (time) {
    if (this.inSectionRange(time)) {
        this.updateDisplayStatus('paused', true);
    }
};
SBTS.am.Section.prototype.updateDisplayStatus = function (state, onOff) {
    var sectionState = this._options.style[state + 'Section'],
        buttonState = this._options.style[state + 'Button'];
    this._elem.classList[onOff?'add':'remove'](sectionState);
    this._elemA.classList[onOff?'add':'remove'](buttonState);
};
SBTS.am.Section.prototype.updateLanguage = function (language) {
    this._language.innerHTML = language;
};
SBTS.am.Section.prototype.updateDisplayTime = function (time) {
    if (win.threeSixtyPlayer) {
        this.timer.innerHTML = win.threeSixtyPlayer
            .getTime(time - this._times.begin, true);
    }
};
}(window));
