'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user6',
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user7',
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user8',
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user9',
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user10',
      email: 'user10@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user11',
      email: 'user11@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user12',
      email: 'user12@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user13',
      email: 'user13@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user14',
      email: 'user14@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user15',
      email: 'user15@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: true,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_teacher: false,
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
