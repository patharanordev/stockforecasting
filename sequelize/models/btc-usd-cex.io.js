const { HistoricalData } = require('./historical-data');

class BTCUSD_CEXIO extends HistoricalData {}
BTCUSD_CEXIO._tableName = 'btc_usd_cexio';

module.exports = BTCUSD_CEXIO;