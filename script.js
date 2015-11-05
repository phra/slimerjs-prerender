var page = require('webpage').create();
var timeout = setTimeout(function() {
    console.log('ERROR');
    slimer.exit();
}, phantom.args[2] || 10000);

page.settings.userAgent = "SlimerJS-prerender";
page.open(phantom.args[0], function (status) {
    //page.viewportSize = { width:1024, height:10000 };
    slimer.wait(phantom.args[1] || 4 * 1000);
    console.log(page.content);
    clearTimeout(timeout);
    slimer.exit();
});

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }

    console.error(msgStack.join('\n'));
    clearTimeout(timeout);
    slimer.exit();
};
