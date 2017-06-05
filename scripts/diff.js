/* eslint-disable no-console */
const chalk = require('chalk');
const core = require('json-diff-core');
const Table = require('easy-table');

const diffScript = async (args) => {
  const leftUrl = args.leftURL;
  const rightURL = args.rightURL;

  const diff = await core.diffURLs(leftUrl, rightURL, args);

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

  console.log(output);
};

module.exports = args => diffScript(args).catch((err) => {
  console.log(chalk.red(err.toString()));
});
