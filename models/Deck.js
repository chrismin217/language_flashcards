module.exports = function (sequelize, DataTypes){

  const Deck = sequelize.define('Deck', {
    title: {type: DataTypes.STRING, allowNull: false},
    native: {type: DataTypes.STRING, allowNull: false},
    target: {type: DataTypes.STRING, allowNull: false}
  },
    {tableName: 'decks'}
  );

  Deck.associate = function (models) {
    Deck.hasMany(models.Card, {
      foreignKey: 'deck_id',
      as: 'Deck'
    });
  }

  return Deck;
}