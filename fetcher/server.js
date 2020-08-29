const express = require('express');
const bodyParser = require('body-parser')
const createTestCafe = require('testcafe');
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

const app = express();
const route = express.Router();
let port = process.env.PORT || 3001;
let testcafe = null;

const getCurrentDate = () => {
    return moment(new Date()).format('MM/DD/YYYY');
}

const getLastRecord = async () => {
    let dt = null;
    try {
        const res = await axios({
            method: 'post',
            url: 'http://0.0.0.0:3002/lastRecord/btc_usd_cexio'
        })

        console.log('Get last record:', res.data);
        dt = res.data && res.data.data ? res.data.data[0].dt : null;

        if(dt) dt = moment(dt, "YYYY-MM-DD").format('MM/DD/YYYY');

    } catch(err) { console.log('Get last record error:', err) }
    
    return dt;
}

route.post('/data/historical', async (req, res) => {
    console.log('body:', req.body)

    /**
     * Get historical data
     * 
     * Request body:
     * @param fromDate  String - start date (if it's not defined, it will searching in DB)
     * @param toDate    String - end date (if it's not defined, it will refer to current date)
     */
    const fromDate = req.body && req.body.from ? req.body.from : await getLastRecord();
    const toDate = req.body && req.body.to ? req.body.to : getCurrentDate();
    
    if(fromDate) {

        console.log({ from:fromDate, to:toDate })

        // Prepare test server
        createTestCafe('0.0.0.0', 1337, 1338)
        .then(async (tc) => {

            testcafe = tc;
            const runner = testcafe.createRunner();
            console.log('Start fetching historical data');

            fs.writeFileSync('./params.json', JSON.stringify({ 
                from: fromDate, //'04/15/2020',
                to: toDate //'04/17/2020'
            }))

            return runner
                .src('investing.com.js')

                // Browsers restrict self-signed certificate usage unless you
                // explicitly set a flag specific to each browser.
                // For Chrome, this is '--allow-insecure-localhost'.
                .browsers('chrome --allow-insecure-localhost')
                .run();
        })
        .then(failedCount => {
            console.log('Tests failed: ' + failedCount);
            testcafe.close()
        });

        res.status(200).json({ error:null, data:'Star fetching data...' })
    } else {
        res.status(400).json({ error:'System got wrong date format, your date format should be "MM/DD/YYYY"', data:null })
    }
});

app.use(bodyParser.json())
app.use(route);

app.listen(port, () => {
    console.log(`Listening on port "${port}"...`)
})

// module.exports = route;
