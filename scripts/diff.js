/* eslint-disable no-console */
const chalk = require('chalk');
const core = require('json-diff-core');
const Table = require('easy-table');

const diffScript = async (args) => {
  const leftUrl = args.leftURL;
  const rightURL = args.rightURL;

  const expectedStatusCode = args.expectedStatusCode ? parseInt(args.expectedStatusCode, 10) : null;
  let customCompare = args.customCompare || '{}';

  try {
    customCompare = JSON.parse(customCompare);
  } catch (err) {
    throw new Error('invalid json provided to customCompare');
  }

  const diff = await core.diffURLs(leftUrl, rightURL, {
    ...args,
    customCompare,
    expectedStatusCode,
  });

  if (args.diffheaders) {
    const headersDiff = await core.diffJSON(diff.leftHeaders, diff.rightHeaders);
    if (headersDiff.length !== 0) {
      if (diff.differences[0].diff === 'none') {
        diff.differences.splice(0, 1);
      }
      diff.differences.unshift({
        key: 'headers',
        left: JSON.stringify(diff.leftHeaders),
        right: JSON.stringify(diff.rightHeaders),
        diff: 'updated',
      });
    }
  }

  const t = new Table();
  diff.differences.forEach((difference) => {
    Object.keys(difference).forEach((key) => {
      const value = difference[key];
      t.cell(key, value);
    });
    t.newRow();
  });

  if (args.output) {
    diff.differences.map((data) => {
      const result = data;
      result.id = 0;
      result.leftURL = diff.leftURL;
      result.rightURL = diff.rightURL;
      result.leftResponseTime = diff.leftResponseTime;
      result.rightResponseTime = diff.rightResponseTime;
      return result;
    });
    if (diff.differences[0].diff === 'none') {
      diff.differences.map((data) => {
        const result = data;
        result.status = 'pass';
        return result;
      });
    } else {
      diff.differences.map((data) => {
        const result = data;
        result.status = 'fail';
        return result;
      });
    }
    await core.writeCSV(args.output, diff.differences);
  }
  const output = t.toString();

  if (!args.quiet) {
    console.log(output);
  }

  if (args.failOnDiff && (diff.differences.length > 1 || diff.differences[0].diff !== 'none')) {
    process.exit(1);
  }
};

module.exports = (args) =>
  diffScript(args).catch((err) => {
    console.log(chalk.red(err.toString()));
    process.exit(1);
  });
