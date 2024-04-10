
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return await queryInterface.bulkInsert('roles', [{
      id: '7f249167-61d9-4b35-83c9-0b792a6ba489',
      name: 'User',
      code: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '3ee2eb37-16a0-4cea-a3c3-b84d72d8ec8d',
      name: 'Admin',
      code: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
