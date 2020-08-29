
const { Sequelize } = require('sequelize');

class DatabaseHandler {
    constructor() {
        this.sequelize = null;
        this.dialect = 'postgres';
        this.dialectOptions = {
            ssl: {
                require: true,
                // Ref.: https://github.com/brianc/node-postgres/issues/2009
                rejectUnauthorized: false,
                // It should use "CA" but Heroku has not "CA"
            },
            keepAlive: true,
        };
    }

    setConfig(db) {
        const options = process.env.NODE_ENV == 'production'
        ? { dialect: this.dialect, dialectOptions: this.dialectOptions, ssl: true, logging: false }
        : { dialect: this.dialect, ssl: false };

        try {
            this.sequelize = new Sequelize(`postgres://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`, options);
        } catch(err) {
            throw err
        }
    }

}

module.exports = DatabaseHandler;