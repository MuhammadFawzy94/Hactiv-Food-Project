'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'address', Sequelize.STRING)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'address')
  }
};
