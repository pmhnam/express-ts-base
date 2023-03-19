
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('users', [{
      id: '559f1dd9-a579-4f15-89cd-0cddbcde1be4',
      username: 'admin',
      email: 'hnam@duck.com',
      firstName: 'Nam',
      lastName: 'Hoang',
      password: '$2a$10$T9Tyue.pKPI4zyrjIGBpIO0iMJAyqeRWi6sU9n3nw7Bzc0AtmpGT2',
      roleId: '3ee2eb37-16a0-4cea-a3c3-b84d72d8ec8d', // get role admin
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {
      where: {
        username: 'admin',
      },
    });
  }
};
