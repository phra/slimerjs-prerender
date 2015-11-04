var page = require('webpage').create();
page.open(phantom.args[0], function (status) {
    //page.viewportSize = { width:1024, height:10000 };
    slimer.wait(phantom.args[1] || 4 * 1000);
    console.log(page.content);
    slimer.exit();
});

