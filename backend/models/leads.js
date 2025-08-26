
const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database'); // Adjust the path as necessary
const { Op } = require('sequelize');

const Leads = sequelize.define('leads', {
  lead_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  score: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  is_email_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  is_phone_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  is_duplicate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  created_at: DataTypes.DATE,

}, {
  tableName: 'leads',
  timestamps: false,
});

module.exports = Leads;
