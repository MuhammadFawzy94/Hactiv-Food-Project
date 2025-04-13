'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'UserId'})
      this.belongsTo(models.Restaurant, {foreignKey: 'RestaurantId'})
      this.belongsTo(models.Menu, {foreignKey: 'MenuId'})
    }
  }
  Order.init({
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    MenuId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};