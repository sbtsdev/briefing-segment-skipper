/* globals SBTS */
(function (win, doc) {
    'use strict';
SBTS.maker('SBTS.am.SegmentGroup');
SBTS.am.SegmentGroup = function (options) {
    this.options = options;
    this.briefing = doc.querySelector(options.briefingQuery);
    this.els = Array.prototype.slice.call(
            doc.querySelectorAll(options.segmentQuery));
    this._segmentsPlaying = false;
    this.segments = [];
    this.els.forEach(this.addSegments.bind(this));
};
SBTS.am.SegmentGroup.prototype.addSegments = function (currentVal) {
    this.segments.push(new SBTS.am.Segment(this.briefing, currentVal,
            this.options));
};
SBTS.am.SegmentGroup.prototype.playSegment = function (segment) {
    segment -= 1;
    if ((segment >= 0) && (segment < this.segments.length)) {
        this.segments[segment].play.call(this.segments[segment]);
    }
};
SBTS.am.SegmentGroup.prototype.bufferStateChanged = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me.segments.forEach(function (current, index, full) {
        full[index].bufferStateChanged(time);
    });
};
SBTS.am.SegmentGroup.prototype.playing = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me._segmentsPlaying = false;
    me.segments.forEach(function (current, index, full) {
        if (full[index].playing(time)) {
            me._segmentsPlaying = true;
        }
    });
};
SBTS.am.SegmentGroup.prototype.paused = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me._segmentsPlaying = false;
    me.segments.forEach(function (current, index, full) {
        full[index].paused(time);
    });
};
SBTS.am.SegmentGroup.prototype.stopped = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me._segmentsPlaying = false;
    me.segments.forEach(function (current, index, full) {
        full[index].stopped(time);
    });
};
SBTS.am.SegmentGroup.prototype.finished = function () {
    this.playing(-1);
};
}(window, document));
