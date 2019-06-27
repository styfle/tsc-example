const { spawn } = require('child_process');

const workpath = '/Users/styfle/Code/js/packagephobia';
const tsc = '/Users/styfle/Code/foo/ts/node_modules/typescript/bin/tsc';

const child = spawn(tsc, { cwd: workpath });
child.stdout.on('data', data => console.log(data.toString()));
child.stderr.on('data', data => console.log(data.toString()));
