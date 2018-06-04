module.exports = function (sequelize, DataTypes) {

  const User = sequelize.define('User', {
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
  },
    {tableName: 'users'}
  );

  User.associate = function (models) {
    User.hasMany(models.Deck, {
      foreignKey: 'user_id',
      as: 'User'
    });
  }

  return User;
}