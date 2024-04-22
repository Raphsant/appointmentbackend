'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'status', {
      type: Sequelize.ENUM,
      values: ['confirmada', 'en espera', 'cancelada'],
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('appointments', 'status');
  }
};
