/* Name spacer for javascript; goal: one exposed global variable */
(function (win) {
    'use strict';
    var SBTS = win.SBTS || {};
    SBTS.maker = function (toMake) {
        var ma = toMake.split('.'), soFar = win, i = 0;
        for (; i < ma.length; i += 1) {
            if (soFar[ma[i]] === undefined) {
                soFar[ma[i]] = {};
            }
            soFar = soFar[ma[i]];
        }
    };
    win.SBTS = SBTS;
}(window, document));
/* globals SBTS */
SBTS.maker('SBTS.util');
SBTS.util.win = (function (win, doc) {
    'use strict';
    return {
        'width': function () {
            return win.innerWidth ||
                    doc.documentElement.clientWidth ||
                    doc.body.clientWidth;
        }
    };
}(window, document));
