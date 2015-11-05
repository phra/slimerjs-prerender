var path = require('path');
var spawn = require('child_process').spawn;

var binPath = path.resolve(__dirname, 'index.js');
var args = ['node', 'index.js'];

var cp = spawn('xvfb-run', args, {stdio: 'inherit'});
