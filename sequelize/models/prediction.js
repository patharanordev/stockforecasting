const { Model, DataTypes } = require('sequelize');
// const uuid = require('uuid');

class Prediction extends Model {}

Prediction._sequelize = null;
Prediction._tableName = 'prediction';

// Prediction.getUUID = function(namespace) {
//     // Create ID from namespace at current timestamp
//     return uuid.v5(namespace, uuid.v1());
// }

Prediction.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

Prediction.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        pid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement : true,
            primaryKey: true,
            unique: true
        },
        stock_name: { type: DataTypes.STRING(10), allowNull: false },
        predict_on: { type: DataTypes.STRING(20), allowNull: false },
        predict_price: { type: DataTypes.REAL, allowNull: false, defaultValue: 0.0 },
        test_send_order: { type: DataTypes.STRING(5), allowNull: false },
        target_date: { type: DataTypes.STRING(20), allowNull: false },
        real_close_price: { type: DataTypes.REAL, allowNull: false, defaultValue: 0.0 },
        result: { type: DataTypes.INTEGER, allowNull: false, defaultValue: -1 },
        created_date: { type: DataTypes.STRING(20), allowNull: false },
        updated_date: { type: DataTypes.STRING(20), allowNull: false },
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

// Prediction.modelSchema = function() {
//     return new Promise((resolve, reject) => {
//         let schema = Object.keys(this.rawAttributes);

//         if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
//         if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

//         try { resolve(schema); } 
//         catch(err) { reject(err); }
//     });
// }

// Prediction.get = function(searchCondition, searchOption=null) {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             let stmt = {};

//             if(searchCondition) stmt['where'] = searchCondition;
//             if(searchOption && searchOption.offset) stmt['offset'] = searchOption.offset;
//             if(searchOption && searchOption.limit) stmt['limit'] = searchOption.limit;
//             if(searchOption && searchOption.order) stmt['order'] = searchOption.order;
//             if(searchOption && searchOption.group) stmt['group'] = searchOption.group;

//             if(Object.keys(stmt).length>0) {
//                 this.findAll(stmt).then((r) => resolve(r))
//                 .catch((err) => reject(err));
//             } else { reject('Unknown filter condition pattern') }
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.set = function(updateObj) {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             if(updateObj.condition && updateObj.data) {
//                 this.update(updateObj.data, { where:updateObj.condition })
//                 .then((r) => resolve(r))
//                 .catch((err) => reject(err));
//             } else { reject('Unknown condition or data') }
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.setLastAccess = function(user_id) {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             if(user_id) {
//                 this.update({ last_access: new Date() }, { where: { user_id:user_id } })
//                 .then((r) => resolve(r))
//                 .catch((err) => reject(err));
//             } else { reject('Unknown user id') }
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.add = function(newUser) {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             if(newUser && newUser.email) {
//                 this.findAndCountAll({ where: { email:newUser.email } })
//                 .then((isExist) => {
//                     if(!(isExist.count && isExist.count > 0 ? true : false)) { 
//                         this.create({
//                             user_id: this.getUUID(newUser.email),
//                             username: newUser.username ? newUser.username : '',
//                             email: newUser.email,
//                             last_access: new Date()
//                         }).then((r) => resolve(r)) 
//                     } else { 
//                         reject('Data existing...')
//                     }
//                 })
//                 .catch((err) => reject(err)); 
//             } else { reject('Unknown user info object pattern.') }
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.delete = function(user_id) {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             if(user_id) {
//                 this.destroy({ where : { user_id:user_id } })
//                 .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
//                 .catch((err) => reject(err));
//             } else { reject('Unknown the id') }
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.dropTable = function() {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             this.drop().then((r) => resolve(r))
//             .catch((err) => reject(err));
//         }).catch((err) => reject(err));
//     })
    
// }

// Prediction.clearData = function() {

//     return new Promise((resolve, reject) => {
//         this.isSequelized().then(() => {
//             this.truncate().then((r) => resolve(r))
//             .catch((err) => reject(err));
//         }).catch((err) => reject(err));
//     })
    
// }

module.exports = Prediction;