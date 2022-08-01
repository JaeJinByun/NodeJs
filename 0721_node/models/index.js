'use strict';

const Sequelize = require('Sequelize');
const Item = require('./item');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Item = Item;
Item.init(sequelize);

module.exports = db;
