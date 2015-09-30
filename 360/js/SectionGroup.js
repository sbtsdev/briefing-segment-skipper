/* globals SBTS */
(function (win, doc) {
    'use strict';
SBTS.maker('SBTS.am.SectionGroup');
SBTS.am.SectionGroup = function (briefingId, sectionId) {
    this.briefing = doc.querySelector(briefingId);
    this.els = Array.prototype.slice.call(
            doc.querySelectorAll(sectionId));
    this._sectionsPlaying = false;
    this.sections = [];
    this.els.forEach(this.addSections.bind(this));
};
SBTS.am.SectionGroup.prototype.addSections = function (currentVal) {
    this.sections.push(new SBTS.am.Section(this.briefing, currentVal));
};
SBTS.am.SectionGroup.prototype.playing = function (pos) {
    pos = parseInt(pos, 10);
    this.updateTimes(pos);
    this.highlightSection(pos);
};
SBTS.am.SectionGroup.prototype.updateTimes = function (time) {
    this.sections.forEach(function (current, index, full) {
        full[index].setLastPlayedTime(time);
    });
};
SBTS.am.SectionGroup.prototype.highlightSection = function (time) {
    var me = this;
    me._sectionsPlaying = false;
    me.sections.forEach(function (current, index, full) {
        if (full[index].highlight(time)) {
            me._sectionsPlaying = true;
        }
    });
};
SBTS.am.SectionGroup.prototype.finished = function () {
    this.highlightSection(-1);
};
}(window, document));
