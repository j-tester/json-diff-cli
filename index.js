#!/usr/bin/env node

const yargs = require('yargs');

const diffScript = require('./scripts/diff');
const csvScript = require('./scripts/csv');

yargs.usage('$0 <cmd> [args]');

yargs
  .command('diff <leftURL> <rightURL> [options]', 'diffs the json response of two URLs.', {
    output: {
      alias: 'o',
      describe: 'print the output to a CSV file',
      type: 'string',
    },
    method: {
      alias: 'm',
      default: 'GET',
      describe: 'request method (GET, POST, or DELETE)',
      type: 'string',
    },
    diffheaders: {
      alias: 'x',
      default: false,
      describe: 'diff the headers as well as the body',
      type: 'boolean',
    },
    sortKey: {
      alias: 'k',
      describe: 'sort any array of json objects by the specified key',
      type: 'string',
    },
    sortKeys: {
      alias: 'K',
      describe: 'multiple sort keys. separate multiple keys with a space: -K "id" "userId"',
      type: 'array',
    },
    timeout: {
      alias: 't',
      describe: 'timeout for requests. defaults to 5 seconds',
      default: 5000,
      type: 'number',
    },
    skipcertificate: {
      alias: 'c',
      describe: 'skip checking of https certificates',
      type: 'string',
    },
    headers: {
      alias: 'H',
      describe: 'attach a header to the request. separate multiple headers with a space: -H "Accept: text/plain" "Accept-Charset: utf-8"',
      type: 'array',
    },
    ignore: {
      alias: 'i',
      describe: 'ignore the provided key(s). separate multiple keys with a space: -i "key1" "key2"',
      type: 'array',
    },
    body: {
      alias: 'b',
      describe: 'request body (only for POST) separate multiple body parts with a space: -b "username: testing" "password: 123"',
      type: 'array',
    },
    arraysortkey: {
      alias: 'a',
      describe: 'sort nested arrays by the sort key, defaults to id',
      type: 'string',
    },
  }, diffScript);

yargs
  .command('csv <path> [options]', 'diffs all urls in a csv file', {
    output: {
      alias: 'o',
      describe: 'print the output to a CSV file',
      type: 'string',
    },
    sleep: {
      alias: 's',
      default: 0,
      describe: 'sleep before every request (in milliseconds)',
      type: 'number',
    },
    diffheaders: {
      alias: 'x',
      default: false,
      describe: 'diff the headers as well as the body',
      type: 'boolean',
    },
    timeout: {
      alias: 't',
      describe: 'timeout for requests. defaults to 5 seconds',
      default: 5000,
      type: 'number',
    },
  }, csvScript);

yargs.help();

yargs.argv; // eslint-disable-line
