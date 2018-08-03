const Sequelize = require('sequelize')

const dbUrl = process.env.DATABASE_URL || "postgres://postgres:secret@localhost:5432/postgres"

const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

module.exports = sequelize