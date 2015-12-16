'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    // UserId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    due_date: DataTypes.STRING,
    recurring: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    postponed: DataTypes.BOOLEAN,
    priority: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Task.belongsTo(models.User); // Will add a UserId attribute to Task to hold the primary key value for User
        Task.hasMany(models.Stars, { foreignKey: 'TaskId' });
      }
    }
  });
  return Task;
};
// User.hasMany(Picture)
// User.belongsTo(Picture, { as: 'ProfilePicture', constraints: false })

