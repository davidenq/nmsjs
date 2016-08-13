'use strict';
const fs = require('fs');
const Prims = require('prismjs');
const {ipcMain} = require('electron');
const commands = require('../config/commands');
const ChildProcess = require('./child-process');

let errs = [];
// Recibe mensajes desde render process
ipcMain.on('asynchronous-message', function(event, data) {

    const commandAll = data.command.split(" ");
    const command = commandAll[0];

    if (commands.allowed.indexOf(command) == -1) {
        conn.emit('response', {
            outcome: 'Comando no disponible'
        });
    } else {

        const size = commandAll.length;
        const args = [];

        for (let i = 1; i < size; i++) {
            args.push(commandAll[i]);
        }

        const cp = new ChildProcess();
        cp.exec(command, args, data.command, (err, stdout) => {

            if (stdout) {

                Prims.languages.css.equal =/=/i;
                Prims.languages.css.time =/[0-9]*:[0-9]*:[0-9]*.[0-9]/i;
                const html = Prims.highlight(stdout, Prims.languages.css);
                //Envía respuesta a render process
                event.sender.send('asynchronous-reply', html);
            } else {
                errs.push(err);
                console.log(errs[1]);
                //Envía respuesta a render process
                event.sender.send('asynchronous-reply', errs[1]);
            }
        });
    }
});

    