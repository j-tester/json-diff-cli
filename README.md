# JSON-DIFF-CLI - [Website](https://www.jtester.com)

json-diff-cli allows you to diff the JSON of two urls and see what the differences are. This tool can be used for testing purposes or to simply check that things are working.

# Usage
```
Commands:

  help [command...]                    Provides help for a given command.
  exit                                 Exits application.
  diff [options] <leftURL> <rightURL>  diffs the json response of two URLs.
  csv [options] <path>                 diffs all urls in a csv file
```

## DIFF
### diff the json between two urls and print to the console.
```
jsondiff diff <leftURL> <rightURL> [options]
```
**`leftURL`**: The base URL you would like to compare to.

**`rightURL`**: The new/updated URL. The JSON from `rightURL` will be compared with the `leftURL` and changes will be printed out to the console.

### Options
```
Usage: diff [options] <leftURL> <rightURL>

diffs the json response of two URLs.

Options:

  --help                        output usage information
  -o, --output <file>           print the output to a CSV file
  -x, --diffheaders             diff the headers as well as the body
  -H, --headers <string>        attach a header to the request. You may string multipe headers together by passing along more -H or --header options
  -i, --ignore <key>            ignore the provided key. You may string multipe ignore keys together by passing along more -i or --ignore options
  -m, --method <method>         request method (GET, POST, or DELETE)
  -b, --body <body>             Request body (only for POST)
  -k, --sortkey <key>           Sort any array of json objects by the specified key
  -t, --timeout <milliseconds>  timeout for requests. defaults to 5 seconds
```

### Example

#### Input
##### leftJSON
```json
{
  "foo": {
    "bar": {
      "a": true,
      "b": "now u see me"
    }
  }
}
```
##### rightJSON
```json
{
  "foo": {
    "bar": {
      "a": false,
      "c": "now you dont"
    }
  }
}
```

#### Output
```
key        left          right         diff
---------  ------------  ------------  -------
foo.bar.c  undefined     now you dont  added
foo.bar.b  now u see me  undefined     deleted
foo.bar.a  true          false         updated
```

## CSV
### diff the json between urls in a csv file, print to the console, and output into a csv file.

```
jsondiff csv <input> [options]
```

**`input`**: Path to the input file (CSV format).

### Options
```
Usage: csv [options] <path>

diffs all urls in a csv file

Options:

  --help                        output usage information
  -o, --output <file>           print the output to a CSV file
  -s, --sleep <milliseconds>    sleep before every request (in milliseconds)
  -x, --diffheaders             diff the headers as well as the body
  -t, --timeout <milliseconds>  timeout for requests. defaults to 5 seconds
```

### Example
#### Input
**The first line in the CSV file must have the following headers. You may chose to omit any of them except for `ur1`, and `url2`**
```
url1, url2, method, headers, body, sortKey, ignore
```

**`ur1`**: Left URL

**`ur2`**: Right URL

**`method`**: Request method, defaults to GET [optional]

**`headers`**: Headers included in the request, pipe delimited. (`|`)

**`body`**: POST body, JSON

**`sortKeys`**: key to sort any arrays by.

**`ignore`**: keys to ignore. Pipe delimted. (`|`)

**`expectedStatusCode`**: Expected status code (defaults to 200)

```csv
url1,url2
https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
```

#### Output
##### csv
```
id,left url,left response time,right url,right response time,key,left value,right value,difference,status
0,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,1197,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,675,foo.bar.c,undefined,now you dont,added,fail
0,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,1197,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,675,foo.bar.b,now u see me,undefined,deleted,fail
0,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,1197,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,675,foo.bar.a,true,none,updated,fail
1,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,481,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,533,foo.bar.c,undefined,now you dont,added,fail
1,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,481,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,533,foo.bar.b,now u see me,undefined,deleted,fail
1,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,481,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,533,foo.bar.a,true,none,updated,fail
2,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,396,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,386,foo.bar.c,undefined,now you dont,added,fail
2,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,396,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,386,foo.bar.b,now u see me,undefined,deleted,fail
2,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json,396,https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json,386,foo.bar.a,true,none,updated,fail
```
##### console
```
https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json vs https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
key        left          right         diff
---------  ------------  ------------  -------
foo.bar.c  undefined     now you dont  added
foo.bar.b  now u see me  undefined     deleted
foo.bar.a  true          false         updated

https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json vs https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
key        left          right         diff
---------  ------------  ------------  -------
foo.bar.c  undefined     now you dont  added
foo.bar.b  now u see me  undefined     deleted
foo.bar.a  true          false         updated

https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/a.json vs https://gist.githubusercontent.com/nahtnam/920171eeef10e911a6ee7698d9c226ae/raw/bdd86427b8c807e149251d4737d2886620f7fcdc/b.json
key        left          right         diff
---------  ------------  ------------  -------
foo.bar.c  undefined     now you dont  added
foo.bar.b  now u see me  undefined     deleted
foo.bar.a  true          false         updated
```
