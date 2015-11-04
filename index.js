var path = require('path');
var spawn = require('child_process').spawn;
var express = require('express');

var port = process.env.port || 4000;
var binPath = path.resolve(__dirname, 'node_modules', 'slimerjs', 'lib', 'slimer', 'slimerjs');
var args = ['script.js', undefined, process.env.wait || 4 * 1000];
var app = express();

app.get('/prerender', function (req, res) {
    var url = "";
    var html = "";
    var cp = undefined;

    args[1] = req.query.url;
    cp = spawn(binPath, args);

    cp.on('error', function(err) {
        res.status(500).send(err.stack);
    });

    cp.stdout.on('data', function(data) {
        html += data;
    });

    cp.on('exit', function(err) {
        res.send(html);
    });
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Slimerjs-prerender listening at http://%s:%s', host, port);
});
