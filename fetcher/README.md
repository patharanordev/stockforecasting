# Historical Data Fetcher

The service using testing framework name `TestCafe` to hook the data from data provider.

## Data Provider

 - [Investing.com](https://www.investing.com/)

## Requirement

 - **MacOS** - recommended OS.
 - [**Node.js**](https://nodejs.org/en/download/) - is a JavaScript runtime built on Chrome's V8 JavaScript engine.
 - [**TestCafe**](https://devexpress.github.io/testcafe/) - A node.js tool to automate end-to-end web testing. Write tests in JS or TypeScript, run them and view results.
 - Don't forget register to your target data provider first.

## Installation

**TestCafe**

```bash
$ npm install -g testcafe
```

## Usage

config some parameter based on your environment:

```js
// ./investing.com.js

const localDirectory = '/Users/[MACHINE_NAME]/Downloads';
const username = 'bompr...@...mail.com';
const password = '......';
const currency = 'BTC_USD';
const currencyPlatform = 'CEX.IO';
const url = 'https://www.investing.com/currencies/xau-usd-historical-data';

// ...
```

and then run command below :
```bash
$ testcafe chrome investing.com.js

# output:
#  Running tests in:
#  - Chrome 80.0.3987.149 / macOS 10.13.6

#  Fetch historical data for XAU_USD
#  ✓ Remove existing file in local directory
#  ✓ Download historical data


#  2 passed (1m 03s)
```

**Note:**

 - Normally, the download file will be wrote to `/Users/[MACHINE_NAME]/Downloads`

## Naming Pattern

### Investing.com

In case the currency data has platform, example :
 
 - Currency `Bitcoin` with `USD` -> `BTC_USD`
 - Platform `CEX.IO`
 - URL -> https://www.investing.com/crypto/bitcoin/btc-usd-historical-data?cid=1054862

Download file name will be `BTC_USD CEX.IO Historical Data.csv`.

In case the currency data is global platform, example :

 - Currency `Gold` with `USD` -> `XAU_USD`
 - URL -> https://www.investing.com/currencies/xau-usd-historical-data

Download file name will be `XAU_USD Historical Data.csv`.

## Limitation

 - Now the service supports `MacOS` only.
 - We cannot guaruntee that download file name has the same file name pattern as present in the future. So, you need to check often for download file name pattern from data provider.
 - Data provider requires user to registater/authentication to their service before allow you to download the data.

## License

MIT