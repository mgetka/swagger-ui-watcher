#!/usr/bin/env node
'use strict';

var program = require('commander');
var fs = require('fs');
var findParentDir = require('find-parent-dir');
var swaggerFileValue;
var targetDirValue;
var help = 'Enter "swagger-ui-watcher --help" for more details.';

program
    .version('1.1.0')
    .arguments('<swaggerFile> [targetDir]')
    .option('-p, --port <port>', 'Port to be used. Default is 8000')
    .option('-h, --host <Hostname|Ip>', 'Host to be used. Default is 127.0.0.1')
    .option('-b, --bundle <bundleTo>', 'Create bundle and save it to bundleTo')
    .action(function(swaggerFile, targetDir) {
        swaggerFileValue = swaggerFile;
        targetDirValue = targetDir;
    })
    .parse(process.argv);

if (typeof swaggerFileValue === 'undefined') {
    console.error(`<swaggerFile> is required.\n${help}`);
    process.exit(1);
}

if (typeof targetDirValue === 'undefined') {
    try {
        targetDirValue = findParentDir.sync(__dirname, swaggerFileValue);
    } catch (err) {
        console.error(`Failed to resolve [targetDir]/${swaggerFileValue}.\n${help}`);
        process.exit(1);
    }
}

if (typeof program.port === 'undefined') {
    program.port = 8000;
}

if (typeof program.host === 'undefined') {
    program.host = "127.0.0.1";
}

if (typeof program.bundle === 'undefined') {
    program.bundle = null;
}

if (program.bundle === swaggerFileValue) {
    console.error("<bundle> value cannot be same as <swaggerFile> value.");
    process.exit(1);
}

if (!fs.existsSync(targetDirValue)) {
    console.error(targetDirValue + " does not exist.");
    process.exit(1);
}

if (!fs.existsSync(swaggerFileValue)) {
    console.error(swaggerFileValue + " does not exist.");
    process.exit(1);
}

if (program.bundle === null) {
    require("../index.js").start(
        swaggerFileValue,
        targetDirValue,
        program.port,
        program.host
    );
} else {
    require("../index.js").build(
        swaggerFileValue,
        targetDirValue,
        program.bundle
    );
}
