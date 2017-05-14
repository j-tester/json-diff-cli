/* eslint-disable no-console, no-restricted-syntax, no-await-in-loop */
const fs = require('fs');
const chalk = require('chalk');
const csv = require('csvtojson');
const core = require('json-diff-core');
const Table = require('easy-table');

const parseCSV = (csvPath) => {
  const result = [];
  return new Promise((resolve, reject) => {
    csv({ noheader: false })
    .fromFile(csvPath)
    .on('json', (obj) => {
      result.push(obj);
    })
    .on('done', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const readFirstLine = csvPath => new Promise((resolve, reject) => {
  const rs = fs.createReadStream(csvPath, { encoding: 'utf8' });
  let acc = '';
  let pos = 0;
  let index;
  rs.on('data', (chunk) => {
    index = chunk.indexOf('\n');
    acc += chunk;
    if (index !== -1) {
      rs.close();
    } else {
      pos += chunk.length;
    }
  })
  .on('close', () => {
    resolve(acc.slice(0, pos + index));
  })
  .on('error', (err) => {
    reject(err);
  });
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const csvScript = async (args, callback) => {
  const csvPath = args.path;

  if (!fs.existsSync(csvPath)) {
    throw new Error('file not found');
  }

  const firstLine = await readFirstLine(csvPath);
  if (!firstLine.includes('url1') || !firstLine.includes('url2')) {
    throw new Error('missing header row');
  }

  const data = await parseCSV(csvPath);

  const allDiffs = [];

  for (let i = 0; i < data.length; i += 1) {
    const row = data[i];
    const url1 = row.url1;
    const url2 = row.url2;
    const method = row.method;
    const sortKey = row.sortKey;
    const body = row.body;
    const timeout = args.options.timeout;

    const header = row.headers;
    const headers = [];
    if (header) {
      const list = header.split('|');
      list.forEach((splitHeader) => {
        headers.push(splitHeader);
      });
    }

    const options = {
      method,
      sortKey,
      body,
      headers,
      timeout,
    };

    try {
      if (args.options.sleep) {
        await sleep(args.options.sleep);
      }
      console.log(chalk.green(`${url1} vs ${url2}`));

      const diff = await core.diffURLs(url1, url2, options);

      if (args.options.diffheaders) {
        const headersDiff = await core.diffJSON(diff.leftHeaders, diff.rightHeaders);
        if (headersDiff.length !== 0) {
          if (diff.differences[0].diff === 'none') {
            diff.differences.splice(0, 1);
          }
          diff.differences.unshift({
            key: 'headers',
            left: `"${JSON.stringify(diff.leftHeaders)}"`,
            right: `"${JSON.stringify(diff.rightHeaders)}"`,
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

      if (args.options.output) {
        diff.differences.map((diffs) => {
          const result = diffs;
          result.id = i;
          result.leftURL = diff.leftURL;
          result.rightURL = diff.rightURL;
          result.leftResponseTime = diff.leftResponseTime;
          result.rightResponseTime = diff.rightResponseTime;
          return result;
        });
        if (diff.differences[0].diff === 'none') {
          diff.differences.map((diffs) => {
            const result = diffs;
            result.status = 'pass';
            return result;
          });
        } else {
          diff.differences.map((diffs) => {
            const result = diffs;
            result.status = 'fail';
            return result;
          });
        }
        diff.differences.forEach((diffs) => {
          allDiffs.push(diffs);
        });
      }

      const output = t.toString();

      console.log(output);
    } catch (err) {
      console.log(chalk.red(err.toString()));
    }
  }

  if (args.options.output) {
    await core.writeCSV(args.options.output, allDiffs);
  }
  callback();
};

module.exports = (args, callback) => csvScript(args, callback).catch((err) => {
  console.log(chalk.red(err.toString()));
  callback();
});
