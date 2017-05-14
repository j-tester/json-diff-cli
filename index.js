#!/usr/bin/env node
const Vorpal = require('vorpal');

const diffScript = require('./scripts/diff');
const csvScript = require('./scripts/csv.js');

const vorpal = Vorpal();

const headers = (val, arr) => {
  arr.push(val);
  return arr;
};

const body = (val, arr) => {
  arr.push(val);
  return arr;
};

vorpal
  .command('diff <leftURL> <rightURL>', 'diffs the json response of two URLs.')
  .option('-o, --output <file>', 'print the output to a CSV file')
  .option('-x, --diffheaders', 'diff the headers as well as the body')
  .option('-H, --headers <string>', 'attach a header to the request. You may string many headers together by passing along more -H or --header options', headers, [])
  .option('-m, --method <method>', 'request method (GET, POST, or DELETE)', 'GET')
  .option('-b, --body <body>', 'Request body (only for POST)', body, [])
  .option('-k, --sortkey <key>', 'Sort any array of json objects by the specified key')
  .option('-t, --timeout <milliseconds>', 'timeout for requests. defaults to 5 seconds', 5000)
  .action(diffScript);

vorpal
  .command('csv <path>', 'diffs all urls in a csv file')
  .option('-o, --output <file>', 'print the output to a CSV file')
  .option('-s, --sleep <milliseconds>', 'sleep before every request (in milliseconds)')
  .option('-x, --diffheaders', 'diff the headers as well as the body')
  .option('-t, --timeout <milliseconds>', 'timeout for requests. defaults to 5 seconds', 5000)
  .action(csvScript);

vorpal
  .parse(process.argv);
