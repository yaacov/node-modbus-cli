# node-modbus-cli
A Modbus client writen in JavaScript

## Introduction

Utility script for accessing Modbus devices. Many hobby devices and PLC controllers speak Modbus.

## Installation

To install, run ``npm install`` if you install from source code, or ``pip install modbus-cli``.

## Usage

The `-h` flag will print out a help text, that list the command line arguments.

```bash
modbus-cli -h

Usage: modbus-cli <command> [options]

Commands:
  read   Read holding registers
  readi  Read input registers
  force  force single coil

Options:
  --config    Path to JSON config file
  -h, --help  Show help                                                [boolean]

Examples:
  modbus-cli read -u 192.168.1.11 -a 5

```

### Querying Holding Registers
Read Holding registers.

```bash
modbus-cli read -u 192.168.1.11 -a 5
modbus-cli read -u /dev/ttyUSB0 -a 0 -l 4
```

### Querying Input Registers
Read Holding registers.

```bash
modbus-cli readi -u 192.168.1.11 -a 5
modbus-cli readi -u /dev/ttyUSB0 -a 0 -l 4
```

### Force one Coil
Force one Coil.

```bash
modbus-cli force -u 192.168.1.11 -a 5 -v 0
modbus-cli force -u /dev/ttyUSB0 -a 0 -v 1
```
