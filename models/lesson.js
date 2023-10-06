'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Lesson.belongsTo(models.User, { foreignKey: 'teacherId' })
    }
  }
  Lesson.init({
    teacherId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    timePerClass: DataTypes.INTEGER,
    availableDay: DataTypes.DATE,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'Lessons',
    underscored: true
  })
  return Lesson
}
