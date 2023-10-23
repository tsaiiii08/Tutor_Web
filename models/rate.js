'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Rate.belongsTo(models.Enrollment, { foreignKey: 'enrollmentId' })
    }
  }
  Rate.init({
    enrollmentId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rate',
    tableName: 'Rates',
    underscored: true
  })
  return Rate
}
