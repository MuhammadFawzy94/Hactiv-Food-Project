'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, {foreignKey: 'RestaurantId'})
      this.hasMany(models.Menu, {foreignKey: 'RestaurantId'})
    }
  }
  Restaurant.init({
    name_restaurant: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};