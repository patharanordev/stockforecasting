
require('dotenv').config({ path:`./.env.${process.env.NODE_ENV}` });

const { sequelize, models } = require('./db-handler.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors())
app.use(bodyParser.json())

function getModelByStockSymbol(symbol) {

    // symbol is FROM(STOCK)_TO(STOCK)_PLATFORM
    
    let m;
    switch(symbol) {
        case 'btc_usd_cexio': m = models.BTCUSD_CEXIO; break;
        default: m = null; break;
    }

    return m;
}

// ex. btc_usd_cexio
app.post('/stock/:symbol', (req, res) => {
    console.log('Got symbol:', req.params.symbol)
    let m = getModelByStockSymbol(req.params.symbol)
    if(m) {
        switch(req.body.method) {
            case 'add':
                m.add(req.body.data).then((r) => {
                    // console.log("Added to DB:", JSON.stringify(r, null, 2));
                    res.status(200).json({ error:null, data:r })
                }).catch(err => {
                    res.status(400).json({ error:err.message, data:null })
                });
                break;
            case 'get':
                m.dataframe(req.body.condition, req.body.period, req.body.options).then((r) => {
                    res.status(200).json({ error:null, data:r })
                }).catch(err => {
                    res.status(400).json({ error:err.message, data:null })
                });
                break;
            default:
                res.status(400).json({ error:'Unknown request method.', data:null })
                break;
        }
    } else {
        res.status(400).json({ error:'Unknown stock symbol.', data:null })
    }
});

// ex. btc_usd_cexio
app.post('/lastRecord/:symbol', (req, res) => {
    console.log('Got symbol:', req.params.symbol)
    let m = getModelByStockSymbol(req.params.symbol)
    if(m) {
        m.lastRecord().then((r) => {
            res.status(200).json({ error:null, data:r })
        }).catch(err => {
            res.status(400).json({ error:err, data:null })
        });
    } else {
        res.status(400).json({ error:'Unknown stock symbol.', data:null })
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


// // Find all prediction
// models.Prediction
// .findAll()
// .then((r) => {
//     console.log("All predictions:", JSON.stringify(r, null, 2));
// })

// // Create table with insert the new one
// sequelize.sync()
// .then(() => models.Prediction.create({
//     pid: 1,
//     stock_name: 'BTCUSD',
//     predict_on: '2020-03-28',
//     predict_price: 21000.0,
//     test_send_order: 'BUY',
//     target_date: '2022-03-28',
//     real_close_price: 0.0,
//     result: -1,
//     created_date: '2020-03-28',
//     updated_date: '',
// }))
// .then(data => {
//     console.log(data.toJSON());
// });
