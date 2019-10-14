var fs_1 = require('fs');

var logStream = fs_1.createWriteStream('./test.log', {
  flags: 'a',
  encoding: 'utf8'
});

logStream.write('Initial line...');
logStream.end('\r');
