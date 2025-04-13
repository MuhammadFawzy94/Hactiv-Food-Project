'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'quantity', Sequelize.INTEGER)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'quantity')
  }
};
