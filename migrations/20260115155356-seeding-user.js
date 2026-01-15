'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Ayush',
        email: 'ayushagrawal133.skb@gmail.com',
        password_hash: 'password',
        role:'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.sequelize.query('DELETE FROM users WHERE email = "ayushagrawal133.skb@gmail.com"');
  }
};
