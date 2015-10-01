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
SBTS.am.SectionGroup.prototype.finished = function () {
    this.playing(-1);
};
}(window, document));
