'use strict';
const {ipcRenderer} = require('electron');

const Vue = require('./resources/js/vue.min.js');

const snmp = {
	el: '#snmjs',
	data: {
		/*Data for snmpv3*/
		netSnmpCommand: '',
		ipv4: '',
		userName: '',
		authProtocol: '',
		authKey: '',
		privProtocol: '',
		privKey: '',
		oidv3: '',
		snmpSetV3Container: false,
		snmpSetValueV3: '',
		disableAuth: false,
		disablePrivProtocol: false,
		disablePriv: false,
		disableContainerPriv: true,
		outcome: '',
		/*Data for snmpv2*/
		snmpCommand: '',
		ip: '',
		community: '',
		oidv2: '',
		snmpSetV2Container: false,
		snmpSetValueV2: '',
		/*command line*/
		commandLine: ''
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
		},
		snmpCommand: function (val, oldVal) {
			if (val === 'snmpset') {
				this.snmpSetV2Container = true
			} else {
				this.snmpSetV2Container = false
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
		snmpv2Handler: function () {
			
			let fullCommand;
			var netSnmpCommand = this.snmpCommand;
	        var ipV4V6 = this.ip;
	        var community = this.community;
	        var oid = this.oidv2;
	        var snmpSetValue = this.snmpSetValueV2;

	        if (netSnmpCommand != 'snmptrap') {

	            fullCommand = netSnmpCommand + ' -c ' + community + ' -v 2c ' + ipV4V6 + ' ' + oid;

	            if (snmpSetValue) {
	                fullCommand += ' s ' + snmpValue;
	            }
	        }

	        ipcRenderer.send('asynchronous-message', {command: fullCommand});
	        ipcRenderer.on('asynchronous-reply', (event, arg) => {
	        	console.log(arg)
	        	this.outcome = arg;
	        });
		},
		commandLineHandler: function () {
			const fullCommand = this.commandLine;
			ipcRenderer.send('asynchronous-message', {command: fullCommand});
	        ipcRenderer.on('asynchronous-reply', (event, arg) => {
	        	this.outcome = arg;
	        });
		}
	}
};

new Vue(snmp);