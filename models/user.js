'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.UserProfile, { foreignKey: 'UserId' });
      User.hasMany(models.Order, { foreignKey: 'UserId' });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
          notNull: { msg: 'Username is required!' }, 
          notEmpty: { msg: 'Username is required' }, 
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
          notNull: { msg: 'Email is required' },
          notEmpty: { msg: 'Email is required' }, 
          isEmail: { msg: 'Email must be a valid email address' }, 
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
          notNull: { msg: 'Password is required' }, 
          notEmpty: { msg: 'Password is required' },
        },
      },
      role: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate(instance, option) {
          const salt = bcrypt.genSaltSync(8);
          const hash = bcrypt.hashSync(instance.password, salt);
          instance.password = hash;
        },
      },
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};