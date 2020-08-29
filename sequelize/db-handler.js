
const { Prediction, BTCUSD_CEXIO } = require('./models');
const DatabaseAPIs = require('./apis/database');

// Connect to database
const db = new DatabaseAPIs();
db.setConfig({
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME
})

// Get Sequelize instance
const sequelize = db.sequelize;
Prediction.initModel(sequelize);
BTCUSD_CEXIO.initModel(sequelize);

module.exports = {
    sequelize,
    models: {
        Prediction,
        BTCUSD_CEXIO
    }
}