/* globals SBTS */
(function (win, doc) {
    'use strict';
SBTS.maker('SBTS.am.SectionGroup');
SBTS.am.SectionGroup = function (options) {
    this.options = options;
    this.briefing = doc.querySelector(options.briefingQuery);
    this.els = Array.prototype.slice.call(
            doc.querySelectorAll(options.sectionQuery));
    this._sectionsPlaying = false;
    this.sections = [];
    this.els.forEach(this.addSections.bind(this));
};
SBTS.am.SectionGroup.prototype.addSections = function (currentVal) {
    this.sections.push(new SBTS.am.Section(this.briefing, currentVal,
            this.options));
};
SBTS.am.SectionGroup.prototype.playing = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me._sectionsPlaying = false;
    me.sections.forEach(function (current, index, full) {
        if (full[index].playing(time)) {
            me._sectionsPlaying = true;
        }
    });
};
SBTS.am.SectionGroup.prototype.paused = function (time) {
    var me = this;
    time = parseInt(time, 10);
    me._sectionsPlaying = false;
    me.sections.forEach(function (current, index, full) {
        full[index].paused(time);
    });
};
SBTS.am.SectionGroup.prototype.finished = function () {
    this.playing(-1);
};
}(window, document));
