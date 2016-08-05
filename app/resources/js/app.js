'use strict';
const {ipcRenderer} = require('electron');

const Vue = require('./vue.min.js');
const v3 = {
	el: '#snmjs',
	data: {
		netSnmpCommand: 'snmpget',
		ipv4: '192.168.1.13',
		userName: 'user1',
		authProtocol: 'MD5',
		authKey: 'gestionwindows',
		privProtocol: 'AES',
		privKey: 'gestionwindows',
		oidv3: '1.3.6.1.2.1.1.5.0',
		snmpSetV3Container: false,
		snmpSetValueV3: '',
		disableAuth: false,
		disablePrivProtocol: false,
		disablePriv: false,
		disableContainerPriv: true,
		outcome: ''
	},
	watch: {
		netSnmpCommand: function (val, oldVal) {
			
			if (val === 'snmpset') {
				this.snmpSetV3Container = true
			} else {
				this.snmpSetV3Container = false
			}
		},
		authProtocol: function (val, oldVal) {
			
			if (val === 'null') {
				this.disableAuth = 'disabled';
				this.disablePrivProtocol = 'disabled';
				this.disableContainerPriv = false;
				this.disablePriv = 'disabled';
				this.privProtocol = 'null';
			} else {

				this.disableContainerPriv = true;
				this.disableAuth = false;
				this.disablePrivProtocol = false;
				this.disablePriv = false;
			}
		},
		privProtocol: function (val, oldVal) {

			if (val === 'null') {
				this.disablePriv = 'disabled';
			} else {
				this.disablePriv = false;
			}
		}
	},
	methods: {
		snmpv3Handler: function () {

			let fullCommand;
			const command = this.netSnmpCommand;
	        const ipV4 = this.ipv4;
	        const userName = this.userName;
	        const authProtocol = this.authProtocol;
	        const privProtocol = this.privProtocol;
	        const authKey = this.authKey;
	        const privKey = this.privKey;
	        const oidv3 = this.oidv3;
	        const snmpSetValueV3 = this.snmpSetValueV3;

	        if (command != 'snmptrap') {
	            if (authProtocol === 'null') {

	                fullCommand = command + ' -v 3 -n "" -u ' + userName + ' -l noAuthNoPriv ' + ipV4 + ' ' + oidv3;
	            } else if (authProtocol && privProtocol == 'null') {

	                fullCommand = command + ' -v 3 -n "" -u ' + userName + ' -a ' + authProtocol + ' -A ' + authKey + ' -l authNoPriv ' + ipV4 + ' ' + oidv3;
	            } else {
	                fullCommand = command + ' -v 3 -n "" -u ' + userName + ' -a ' + authProtocol + ' -A ' + authKey + ' -x ' + privProtocol + ' -X ' + privKey + ' -l authPriv ' + ipV4 + ' ' + oidv3;
	            }

	            if (snmpSetValueV3) {

	                fullCommand += ' s ' + snmpSetValueV3;
	            }
	        }
	        ipcRenderer.send('asynchronous-message', {command: fullCommand});
	        ipcRenderer.on('asynchronous-reply', (event, arg) => {
	        	console.log(arg)
	        	this.outcome = arg;
	        });

		},
		snmpv2Handler: function () {},
		expertHandler: function () {}
	}
};
new Vue(v3);