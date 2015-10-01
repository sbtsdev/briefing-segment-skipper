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
    var startFrom = this._times.begin;
    e.preventDefault();
    if (win.threeSixtyPlayer) {
        if (! this._soundInstance) {
            win.threeSixtyPlayer.handleClick({
                target:this.briefing,
                preventDefault:function(){}});
            this.setSoundManagerInstance();
        }
        if ((this._soundInstance.readyState === 3) &&
            (this._soundInstance.playState === 1) &&
            /* if the current position is within the play range then the
             * user is trying to play or pause this section */
            (this.inSectionRange(this._soundInstance.position))) {
            if (this._soundInstance.paused) {
                this._soundInstance.resume();
                this.updateDisplayStatus('paused', false);
            } else {
                this._soundInstance.pause();
                this.updateDisplayStatus('paused', true);
            }
        } else {
            /* user could have clicked on a section for the first time
             * or clicked on a section that is not currently playing */
            /* startFrom uses division (/) and Math.ceil to make up for
             * partial sections of play */
            startFrom = (Math.ceil(this._lastPlayedTime / 1000) >=
                        (this._times.end / 1000)) ?
                            this._times.begin : this._lastPlayedTime;
            this._soundInstance.stop();
            this._soundInstance.play({
                from    : startFrom,
                to      : this._times.end
            });
        }
    }
};
SBTS.am.Section.prototype.inSectionRange = function (time) {
    return (time > this._times.begin) && (time < this._times.end);
};
SBTS.am.Section.prototype.updateDisplay = function (time) {
    this.updateDisplayStatus('playing', true);
    this.updateDisplayStatus('paused', false);
    this.updateDisplayTime(time);
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
        this.updateDisplay(time);
        return true; // yes, it was highlighted
    } else {
        this.updateDisplayStatus('playing', false);
        this.updateDisplayStatus('paused',
            (this._lastPlayedTime !== this._times.begin));
        return false;
    }
};
SBTS.am.Section.prototype.updateDisplayStatus = function (cl, onOff) {
    this.elem.classList[onOff?'add':'remove'](cl);
    this.elemA.classList[onOff?'add':'remove'](cl);
};
SBTS.am.Section.prototype.updateDisplayTime = function (time) {
    if (win.threeSixtyPlayer) {
        this.timer.innerHTML = win.threeSixtyPlayer.getTime(time, true);
    }
};
}(window));
