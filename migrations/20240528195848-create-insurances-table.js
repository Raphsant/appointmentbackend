'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'insuranceId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'insurances', // Name of the table the foreign key references
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'insuranceId');
  }
};
