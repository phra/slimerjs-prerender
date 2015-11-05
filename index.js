var path = require('path');
var spawn = require('child_process').spawn;
var express = require('express');

var stripScriptsRegex = /<script(?:.*?)>(?:[\S\s]*?)<\/script>/gi;
var stripScripts = process.env.strip || true;
var port = process.env.port || 4000;
var binPath = path.resolve(__dirname, 'node_modules', 'slimerjs', 'lib', 'slimer', 'slimerjs');
var args = ['script.js', undefined, process.env.wait || 4 * 1000, process.env.kill || 10000];
var app = express();


function fetch(url, req, res) {
    var html = "";
    var cp = undefined;

    args[1] = url;
    cp = spawn(binPath, args);

    cp.on('error', function(err) {
        res.sendStatus(500);
    });

    cp.stdout.on('data', function(data) {
        html += data;
    });

    cp.on('exit', function(err) {
        if (stripScripts && html) {
            var matches = html.match(stripScriptsRegex);

            if (!matches || html.startsWith('ERROR')) {
                return res.sendStatus(500);
            }

            for (var i = 0; i < matches.length; i++) {
                if (matches[i].indexOf('application/ld+json') === -1) {
                    html = html.replace(matches[i], '');
                }
            }
        }

        res.send(html);
    });
}

app.get('/*', function(req, res) {
    req.path !== '/' ? fetch(req.path.substring(1, req.path.length), req, res) : res.sendStatus(404);
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('SlimerJS-prerender listening at http://%s:%s', host, port);
});
