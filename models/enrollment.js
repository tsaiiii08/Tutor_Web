'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Enrollment.belongsTo(models.Lesson, { foreignKey: 'lessonId' })
      Enrollment.belongsTo(models.User, { foreignKey: 'studentId' })
      Enrollment.belongsTo(models.Rate, { foreignKey: 'enrollmentId' })
    }
  }
  Enrollment.init({
    lessonId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'Enrollments',
    underscored: true
  })
  return Enrollment
}
