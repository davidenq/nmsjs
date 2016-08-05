'use strict';

class ChildProcess {

    constructor() {
        this.spawn = require('child_process').spawn;
    }

    exec(command, args, commandAll, next) {

        if (args.length > 6) {
            const exec = require('child_process').exec
            const child = exec(commandAll, (err, stdout, stderr) => {

                if (err) {
                    next(err);
                }
                if (stderr) {
                    next(stderr);
                }
                console.log(commandAll)
                next(null, stdout);
            });
        } else {

            const ps = this.spawn(command, args);

            ps.stdout.on('data', function(data) {

                const info = data.toString('utf8');
                next(null, info);
            });

            ps.stdout.on('end', function(data) {
                console.log('ending');
            });

            ps.stderr.on('data', (err) => {

                const info = err.toString('utf8');
                next(info);
            });

            ps.on('exit', function(code) {

                if (code != 0) {
                    next(null, code);
                }
            });
        }
    }
}

exports = module.exports = ChildProcess;