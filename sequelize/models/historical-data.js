const { Model, DataTypes, Op } = require('sequelize');

class HistoricalData extends Model {}

HistoricalData._sequelize = null;
HistoricalData._tableName = 'historical_data';

HistoricalData.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

HistoricalData.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        dt: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        price: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        open: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        high: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        low: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        vol: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

HistoricalData.modelSchema = function() {
    return new Promise((resolve, reject) => {
        let schema = Object.keys(this.rawAttributes);

        if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
        if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

        try { resolve(schema); } 
        catch(err) { reject(err); }
    });
}

HistoricalData.dataframe = function(searchCondition, period, searchOption=null) {

    console.log('Get:')
    console.log(' - search condition:', searchCondition)
    console.log(' - search period:', period)
    console.log(' - search options:', searchOption)

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            let stmt = {};

            if(searchCondition) stmt['where'] = searchCondition;
            if(searchOption && searchOption.offset) stmt['offset'] = searchOption.offset;
            if(searchOption && searchOption.limit) stmt['limit'] = searchOption.limit;
            if(searchOption && searchOption.order) stmt['order'] = searchOption.order;
            if(searchOption && searchOption.group) stmt['group'] = searchOption.group;

            if(period && period.field) {
                stmt['where'][period.field] = {
                    ...{ [Op.gte]: period.from, [Op.lte]: period.to } 
                }
            }

            console.log(' - search statement:', stmt)

            if(Object.keys(stmt).length>0) {
                this.findAll(stmt).then((r) => resolve(r))
                .catch((err) => {
                    console.log(' - Find all error:', err)
                    reject(err)
                });
            } else { reject('Unknown filter condition pattern') }
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.get = function(searchCondition, searchOption=null) {

    console.log('Get:')
    console.log(' - search condition:', searchCondition)
    console.log(' - search options:', searchOption)

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            let stmt = {};

            if(searchCondition) stmt['where'] = searchCondition;
            if(searchOption && searchOption.offset) stmt['offset'] = searchOption.offset;
            if(searchOption && searchOption.limit) stmt['limit'] = searchOption.limit;
            if(searchOption && searchOption.order) stmt['order'] = searchOption.order;
            if(searchOption && searchOption.group) stmt['group'] = searchOption.group;

            console.log(' - search statement:', stmt)

            if(Object.keys(stmt).length>0) {
                this.findAll(stmt).then((r) => resolve(r))
                .catch((err) => {
                    console.log(' - Find all error:', err)
                    reject(err)
                });
            } else { reject('Unknown filter condition pattern') }
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.lastRecord = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.max('dt').then((dt) => {
                this.findAll({
                    attributes: ['dt', 'price', 'open', 'high', 'low', 'vol'],
                    where: { dt: dt }
                })
                .then((r) => resolve(r))
                .catch((err) => { console.log(err); reject(err); });
            })
            .catch((err) => { console.log(err); reject(err); })
        }).catch((err) => { console.log(err); reject(err); });
    })
    
}

HistoricalData.set = function(updateObj) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(updateObj.condition && updateObj.data) {
                this.update(updateObj.data, { where:updateObj.condition })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown condition or data') }
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.add = function(newRecords) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newRecords && Array.isArray(newRecords) && newRecords.length>0) {

                this.bulkCreate(newRecords, { returning: ['dt'], ignoreDuplicates:true })
                .then((r) => resolve(r))
                .catch((err) => reject(err)); 

            } else { reject('Unknown bulk data object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.delete = function(dt) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(user_id) {
                this.destroy({ where : { dt:dt } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown that date') }
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

HistoricalData.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = {
    HistoricalData
};