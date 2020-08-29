import { Selector } from 'testcafe'; // first import testcafe selectors
import moment from 'moment';
import axios from 'axios';
import has from 'has';
import fs from 'fs';
import os from 'os';

const localDirectory = '/Users/macintosh/Downloads';
const username = INVESTING_DOT_COM_USER_NAME;
const password = INVESTING_DOT_COM_PASSWORD;
const currency = 'BTC_USD'; // 'XAU_USD';
const currencyPlatform = 'CEX.IO'; // '';
// const url = 'https://www.investing.com/currencies/xau-usd-historical-data';
const url = 'https://www.investing.com/crypto/bitcoin/btc-usd-historical-data?cid=1054862';

const isMac = os.type().toString().match('Darwin');

fixture `Fetch historical data for "${currency}"${
        currencyPlatform != ''
        ? ` of ${currencyPlatform} platform`
        : ''
    }`
    .page `${url}`;  // specify the start page

const filename = `${currency} ${currencyPlatform!=''?(currencyPlatform+' '):''}Historical Data.csv`;
const downloadFilePath = `${localDirectory}/${filename}`;

test('Remove existing file in local directory', async t => {

    if(fs.existsSync(downloadFilePath)) {
        fs.unlinkSync(downloadFilePath);
    }

    await t.expect(fs.existsSync(downloadFilePath)).notOk('File does not exist')
});

test('Download historical data', async t => {

    let params = null;
    let paramFilePath = './params.json';

    if(fs.existsSync(paramFilePath)) {
        params = JSON.parse(fs.readFileSync(paramFilePath))
        console.log('Parameters :', params);
    }

    try {

        await t.expect(params).notEql(null, 'Found parameter file.');

        if(params) {

            console.log('Target download file path :', downloadFilePath)

            await t
                .click(Selector('a').withText('Download Data'))

                // Sign-in
                .typeText('#loginFormUser_email', username)
                .typeText('#passwordSigningNotify', password)
                .click(Selector('a.newButton.orange').withText('Sign In'))
                .wait(15000)




                .click(Selector('div#widgetField'))
                .wait(100)
                .click(Selector('input#startDate'), { caretPos: 0 })
                // .pressKey(isMac ? 'meta+a delete' : 'ctrl+a delete')
                // .pressKey('delete delete delete delete delete delete delete delete delete delete')
                .pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right')
                .pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right')
                .typeText('input#startDate', params.from)

                .click(Selector('input#endDate'), { caretPos: 0 })
                // .pressKey(isMac ? 'meta+a delete' : 'ctrl+a delete')
                // .pressKey('delete delete delete delete delete delete delete delete delete delete')
                .pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right')
                .pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right').pressKey('shift+right')
                .typeText('input#endDate', params.to)

                .click(Selector('a#applyBtn'))
                .wait(1000)



                // Download historical file
                .click(Selector('a').withText('Download Data'))
                .wait(10000)
        
            await t.expect(fs.existsSync(downloadFilePath)).eql(true, 'Found download file');

        }

    } catch (err) {
        console.log(err);
    } finally {

        if(fs.existsSync(paramFilePath)) {
            fs.unlinkSync(paramFilePath)
        }

    }

});

test('Upload to database', async t => {

    if(fs.existsSync(downloadFilePath)) {

        let bulkData = [];
        let downloadFileContent = fs.readFileSync(downloadFilePath, 'utf8');
        console.log('Download file content : ', downloadFileContent);

        await t.expect(downloadFileContent.length).notEql(0, 'Download file has content');

        // split the contents by new line
        const lines = downloadFileContent.split(/\r?\n/);

        // print all lines
        lines.forEach((line, lineIndex) => {
            console.log(line);

            if(line.length<2) return false;

            if(lineIndex>0) {
                let lineObj = line.replace(/","/g, '\";\"').replace(/"/g, '').split(';');
                console.log(lineObj);
                let volCol = lineObj[5];
                let volume = 0;
                
                if(volCol) {
                    if (volCol.indexOf('K') > -1) {
                        volume = parseFloat(volCol.replace('K', '')) * 1000
                    } else if (volCol.indexOf('B') > -1) {
                        volume = parseFloat(volCol.replace('B', '')) * 1000000
                    } else if (volCol.indexOf('-') > -1) {
                        volume = 0
                    } else {
                        volume = parseFloat(volCol);
                    }
                }

                let ts = moment((lineObj[0]), "MMM DD, YYYY").format('YYYY-MM-DD');
                let tmpBulk = {
                    dt: ts,
                    price: lineObj[1].replace(',', ''),
                    open: lineObj[2].replace(',', ''),
                    high: lineObj[3].replace(',', ''),
                    low: lineObj[4].replace(',', ''),
                    vol: volume.toString()
                }

                // Bulk data style
                bulkData.push(tmpBulk);
            }
        });

        const res = await axios({
            method: 'post',
            url: 'http://0.0.0.0:3002/stock/btc_usd_cexio',
            data: {
                "method":"add",
                "data":bulkData
            }
        })

        console.log('Recording to DB response:', res.data)
        
        await t.expect(has(res.data, 'data')).eql(true, 'Should response data after recorded to database.');
        
    }
    
});