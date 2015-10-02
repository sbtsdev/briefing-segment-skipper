/* globals SBTS,ThreeSixtyPlayer */
(function (win) {
    'use strict';
SBTS.maker('SBTS.am.Section');
/* Create a section class to hold common stuff */
SBTS.am.Section = function (briefing, el) {
    this._soundInstance = null;
    this._times = {begin:0,end:Number.POSITIVE_INFINITY};

    this.briefing = briefing;
    this.elem = el;
    this.elemA = el.querySelector('.section-button');
    this.timer = this.elemA.querySelector('.timer');

    this.setTimer();
    this._lastPlayedTime = this._times.begin;
    this.updateDisplayTime(this._times.begin);
    this.setSoundManagerInstance();
    this.addEvents();
};
SBTS.am.Section.prototype.setTimer = function () {
    this._times = {
        begin:  parseInt(this.elemA.getAttribute('data-begin'), 10) * 1000,
        end:    parseInt(this.elemA.getAttribute('data-end'), 10) * 1000
    };
};
SBTS.am.Section.prototype.setSoundManagerInstance = function () {
    if (ThreeSixtyPlayer && win.threeSixtyPlayer) {
        this._soundInstance = win.threeSixtyPlayer
            .getSoundByURL(this.briefing.href);
    }
};
SBTS.am.Section.prototype.play = function (e) {
    var sI = this._soundInstance,
        startFrom = this._times.begin;
    e.preventDefault();
    if (win.threeSixtyPlayer) {
        if (! sI) {
            win.threeSixtyPlayer.handleClick({
                target:this.briefing,
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
            } else {
                sI.pause();
                this.updateDisplayStatus('paused', true);
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
    this.elemA.addEventListener('click', this.play.bind(this));
};
SBTS.am.Section.prototype.playing = function (time) {
    if (this.inSectionRange(time)) {
        this.setLastPlayedTime(time);
        this.updateDisplayTime(time);
        this.updateDisplayStatus('playing', true);
        this.updateDisplayStatus('paused', false);
        return true; // yes, it was highlighted
    } else {
        if (this._lastPlayedTime !== this._times.begin) {
            // it's only paused if it already started
            this.updateDisplayStatus('paused', true);
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
    this.elem.classList[onOff?'add':'remove'](state);
    this.elemA.classList[onOff?'add':'remove'](state);
};
SBTS.am.Section.prototype.updateDisplayTime = function (time) {
    if (win.threeSixtyPlayer) {
        this.timer.innerHTML = win.threeSixtyPlayer.getTime(time, true);
    }
};
}(window));
