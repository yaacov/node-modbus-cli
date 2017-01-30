#!/usr/bin/env node

// parse user arguments
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .config("config")
    .command('read', 'Read holding registers', {
        url: {
            alias: 'u',
            demand: true,
            nargs: 1,
            describe: 'URL (e.g. "/dev/ttyUSB0", "192.168.1.11")'
        },
        addr: {
            alias: 'a',
            demand: true,
            nargs: 1,
            describe: 'Starting address'
        },
        port: {
            alias: 'p',
            nargs: 1,
            default: 502,
            describe: 'TCP port'
        },
        baudrate: {
            alias: 'b',
            nargs: 1,
            default: 9600,
            describe: 'Serial port baudrate'
        },
        unitid: {
            alias: 'i',
            nargs: 1,
            default: 1,
            describe: 'Unit ID'
        },
        len: {
            alias: 'l',
            nargs: 1,
            default: 1,
            describe: 'Number of registers to read'
        },
        type: {
            alias: 't',
            choices: ['int', 'float'],
            default: 'int',
            describe: 'Parse registers as'
        },
      })
      .command('readi', 'Read input registers', {
        url: {
            alias: 'u',
            demand: true,
            nargs: 1,
            describe: 'URL (e.g. "/dev/ttyUSB0", "192.168.1.11")'
        },
        addr: {
            alias: 'a',
            demand: true,
            nargs: 1,
            describe: 'Starting address'
        },
        port: {
            alias: 'p',
            nargs: 1,
            default: 502,
            describe: 'TCP port'
        },
        baudrate: {
            alias: 'b',
            nargs: 1,
            default: 9600,
            describe: 'Serial port baudrate'
        },
        unitid: {
            alias: 'i',
            nargs: 1,
            default: 1,
            describe: 'Unit ID'
        },
        len: {
            alias: 'l',
            nargs: 1,
            default: 1,
            describe: 'Number of registers to read'
        },
        type: {
            alias: 't',
            choices: ['int', 'float'],
            default: 'int',
            describe: 'Parse registers as'
        },
    })
    .example('$0 read -u 192.168.1.11 -a 5', 'read one register at address 5')

    .demandCommand(1, 'Error: no a valid command')
    .help('h')
    .alias('h', 'help')
    .argv;

// get the command
var command = argv._[0];

var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

// open connection to a serial or tcp port
if (argv.url[0] === '/') {
    client.connectRTU(argv.url, {baudrate: argv.baudrate})
        .then(setClient)
        .catch(function(e) {
            console.log(e.message); });
} else {
    client.connectTCP(argv.url, {port: argv.port})
        .then(setClient)
        .catch(function(e) {
            console.log(e.message); });
}


function setClient() {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(argv.unitid);
    client.setTimeout(1000);

    // run command
    switch(command) {
    case 'read':
        read();
        break;
    case 'readi':
        readInput();
        break;
    default:
        console.log('Error: unsupported command');
        close();
    }
}

function outputBuffer(buf, type) {
    var step ;
    var readFunc;

    switch (type) {
        case 'int':
            step = 2;
            readFunc = function(i) {return buf.readInt16BE(i); };
            break;
        case 'float':
            step = 4;
            readFunc = function(i) {return buf.readFloatBE(i); };
            break;
        default:
            step = 2;
            readFunc = function(i) {return buf.readInt16BE(i); };
            break;
    }
    var len = buf.length - step;

    for (var i = 0; i <= len; i += step) {
        value = readFunc(i);
        process.stdout.write(value.toFixed(4) + "\t");
    }
}

function read() {
    client.readHoldingRegisters(argv.addr, argv.len)
      .then(function(d) {
          outputBuffer(d.buffer, argv.type) })
      .catch(function(e) {
          console.log(e.message); })
      .then(close);
}

function readInput() {
    client.readInputRegisters(argv.addr, argv.len)
      .then(function(d) {
          outputBuffer(d.buffer, argv.type) })
      .catch(function(e) {
          console.log(e.message); })
      .then(close);
}

function close() {
    client.close();
}
